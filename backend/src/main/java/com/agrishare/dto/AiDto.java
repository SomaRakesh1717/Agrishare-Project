package com.agrishare.dto;

import java.util.List;

public class AiDto {

    public static class ChatMessageItem {
        private String role; // "user" or "assistant"
        private String content;

        public ChatMessageItem() {}
        public ChatMessageItem(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class ChatRequest {
        private String message;
        private List<ChatMessageItem> history;

        public ChatRequest() {}
        public ChatRequest(String message, List<ChatMessageItem> history) {
            this.message = message;
            this.history = history;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public List<ChatMessageItem> getHistory() { return history; }
        public void setHistory(List<ChatMessageItem> history) { this.history = history; }
    }

    public static class ChatResponse {
        private String reply;
        private String source; // "AGRI_EXPERT_AI" or "GEMINI_LIVE"
        private List<String> suggestions;

        public ChatResponse() {}
        public ChatResponse(String reply, String source, List<String> suggestions) {
            this.reply = reply;
            this.source = source;
            this.suggestions = suggestions;
        }

        public String getReply() { return reply; }
        public void setReply(String reply) { this.reply = reply; }
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public List<String> getSuggestions() { return suggestions; }
        public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
    }
}
