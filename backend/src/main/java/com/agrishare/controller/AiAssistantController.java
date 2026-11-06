package com.agrishare.controller;

import com.agrishare.dto.AiDto;
import com.agrishare.service.AiAssistantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    public AiAssistantController(AiAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody AiDto.ChatRequest request) {
        try {
            AiDto.ChatResponse response = aiAssistantService.generateAgronomicAdvice(request);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error communicating with AI assistant: " + ex.getMessage()));
        }
    }
}
