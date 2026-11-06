package com.agrishare.service;

import com.agrishare.dto.ChatDto;
import com.agrishare.model.ChatMessage;
import com.agrishare.model.User;
import com.agrishare.repository.ChatMessageRepository;
import com.agrishare.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatService(ChatMessageRepository chatMessageRepository,
                       UserRepository userRepository,
                       SimpMessagingTemplate messagingTemplate) {
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public ChatMessage sendMessage(String senderEmail, ChatDto.SendMessageRequest request) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User recipient = userRepository.findById(request.getRecipientId())
                .orElseGet(() -> userRepository.findByEmail(request.getRecipientId())
                        .orElseThrow(() -> new RuntimeException("Recipient not found with id: " + request.getRecipientId())));

        ChatMessage message = new ChatMessage(
                sender.getId(),
                sender.getName(),
                recipient.getId(),
                recipient.getName(),
                request.getResourceId(),
                request.getResourceTitle(),
                request.getContent()
        );
        message.setTimestamp(Instant.now());
        message.setReadStatus(false);

        ChatMessage saved = chatMessageRepository.save(message);

        // Push real-time over STOMP WebSocket topic for recipient and sender
        try {
            messagingTemplate.convertAndSend("/topic/messages/" + recipient.getId(), saved);
            messagingTemplate.convertAndSend("/topic/messages/" + sender.getId(), saved);
            messagingTemplate.convertAndSendToUser(recipient.getId(), "/queue/messages", saved);
        } catch (Exception ex) {
            // Log WebSocket delivery failure without failing database save
            System.err.println("WebSocket dispatch warning: " + ex.getMessage());
        }

        return saved;
    }

    public List<ChatMessage> getConversation(String userEmail, String peerId) {
        User current = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // peerId could be either MongoDB ID or email
        String actualPeerId = peerId;
        Optional<User> peerOpt = userRepository.findById(peerId);
        if (peerOpt.isEmpty()) {
            peerOpt = userRepository.findByEmail(peerId);
            if (peerOpt.isPresent()) {
                actualPeerId = peerOpt.get().getId();
            }
        }

        List<ChatMessage> conversation = chatMessageRepository.findConversation(current.getId(), actualPeerId);
        // Mark messages as read
        for (ChatMessage msg : conversation) {
            if (current.getId().equals(msg.getRecipientId()) && !msg.isReadStatus()) {
                msg.setReadStatus(true);
                chatMessageRepository.save(msg);
            }
        }

        return conversation.stream()
                .sorted(Comparator.comparing(ChatMessage::getTimestamp))
                .collect(Collectors.toList());
    }

    public List<ChatDto.ConversationSummary> getConversations(String userEmail) {
        User current = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ChatMessage> allMessages = chatMessageRepository.findAllForUser(current.getId());

        // Group by peer
        Map<String, List<ChatMessage>> peerMap = new HashMap<>();
        for (ChatMessage msg : allMessages) {
            String peerId = current.getId().equals(msg.getSenderId()) ? msg.getRecipientId() : msg.getSenderId();
            if (peerId != null && !peerId.equals(current.getId())) {
                peerMap.computeIfAbsent(peerId, k -> new ArrayList<>()).add(msg);
            }
        }

        List<ChatDto.ConversationSummary> summaries = new ArrayList<>();
        for (Map.Entry<String, List<ChatMessage>> entry : peerMap.entrySet()) {
            String peerId = entry.getKey();
            List<ChatMessage> msgs = entry.getValue();
            msgs.sort(Comparator.comparing(ChatMessage::getTimestamp).reversed());
            ChatMessage latest = msgs.get(0);

            Optional<User> peerUser = userRepository.findById(peerId);
            ChatDto.ConversationSummary summary = new ChatDto.ConversationSummary();
            summary.setPeerId(peerId);
            summary.setPeerName(peerUser.map(User::getName).orElse(latest.getSenderId().equals(current.getId()) ? latest.getRecipientName() : latest.getSenderName()));
            summary.setPeerAvatar(peerUser.map(User::getAvatarUrl).orElse("https://images.unsplash.com/photo-1544717305-2782549b5136?w=150"));
            summary.setLastMessage(latest.getContent());
            summary.setLastMessageTimestamp(latest.getTimestamp());
            summary.setResourceTitle(latest.getResourceTitle());

            long unread = msgs.stream()
                    .filter(m -> current.getId().equals(m.getRecipientId()) && !m.isReadStatus())
                    .count();
            summary.setUnreadCount((int) unread);

            summaries.add(summary);
        }

        summaries.sort(Comparator.comparing(ChatDto.ConversationSummary::getLastMessageTimestamp, Comparator.nullsLast(Comparator.reverseOrder())));
        return summaries;
    }
}
