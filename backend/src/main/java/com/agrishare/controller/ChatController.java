package com.agrishare.controller;

import com.agrishare.dto.ChatDto;
import com.agrishare.model.ChatMessage;
import com.agrishare.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody ChatDto.SendMessageRequest request, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        try {
            ChatMessage saved = chatService.sendMessage(authentication.getName(), request);
            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/conversation/{peerId}")
    public ResponseEntity<?> getConversation(@PathVariable String peerId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        try {
            List<ChatMessage> conversation = chatService.getConversation(authentication.getName(), peerId);
            return ResponseEntity.ok(conversation);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/conversations")
    public ResponseEntity<?> getConversations(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        try {
            List<ChatDto.ConversationSummary> conversations = chatService.getConversations(authentication.getName());
            return ResponseEntity.ok(conversations);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
