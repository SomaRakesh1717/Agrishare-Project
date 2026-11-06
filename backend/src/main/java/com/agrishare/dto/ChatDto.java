package com.agrishare.dto;

import java.time.Instant;

public class ChatDto {

    public static class SendMessageRequest {
        private String recipientId;
        private String resourceId;
        private String resourceTitle;
        private String content;

        public SendMessageRequest() {}

        public String getRecipientId() { return recipientId; }
        public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
        public String getResourceId() { return resourceId; }
        public void setResourceId(String resourceId) { this.resourceId = resourceId; }
        public String getResourceTitle() { return resourceTitle; }
        public void setResourceTitle(String resourceTitle) { this.resourceTitle = resourceTitle; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class ConversationSummary {
        private String peerId;
        private String peerName;
        private String peerAvatar;
        private String lastMessage;
        private Instant lastMessageTimestamp;
        private int unreadCount;
        private String resourceTitle;

        public ConversationSummary() {}

        public String getPeerId() { return peerId; }
        public void setPeerId(String peerId) { this.peerId = peerId; }
        public String getPeerName() { return peerName; }
        public void setPeerName(String peerName) { this.peerName = peerName; }
        public String getPeerAvatar() { return peerAvatar; }
        public void setPeerAvatar(String peerAvatar) { this.peerAvatar = peerAvatar; }
        public String getLastMessage() { return lastMessage; }
        public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }
        public Instant getLastMessageTimestamp() { return lastMessageTimestamp; }
        public void setLastMessageTimestamp(Instant lastMessageTimestamp) { this.lastMessageTimestamp = lastMessageTimestamp; }
        public int getUnreadCount() { return unreadCount; }
        public void setUnreadCount(int unreadCount) { this.unreadCount = unreadCount; }
        public String getResourceTitle() { return resourceTitle; }
        public void setResourceTitle(String resourceTitle) { this.resourceTitle = resourceTitle; }
    }
}
