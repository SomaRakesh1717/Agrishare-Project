package com.agrishare.repository;

import com.agrishare.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    @Query("{ '$or': [ " +
           "  { 'senderId': ?0, 'recipientId': ?1 }, " +
           "  { 'senderId': ?1, 'recipientId': ?0 } " +
           "] }")
    List<ChatMessage> findConversation(String user1, String user2);

    @Query("{ '$or': [ { 'senderId': ?0 }, { 'recipientId': ?0 } ] }")
    List<ChatMessage> findAllForUser(String userId);

    List<ChatMessage> findByRecipientIdAndReadStatusFalse(String recipientId);
}
