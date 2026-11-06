package com.agrishare.controller;

import com.agrishare.dto.ChatDto;
import com.agrishare.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;

    public ChatWebSocketController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat.send")
    public void handleWebSocketMessage(@Payload ChatDto.SendMessageRequest request, Principal principal) {
        if (principal != null) {
            chatService.sendMessage(principal.getName(), request);
        }
    }
}
