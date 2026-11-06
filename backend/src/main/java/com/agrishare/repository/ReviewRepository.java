package com.agrishare.repository;

import com.agrishare.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(String targetType, String targetId);
    List<Review> findByReviewerIdOrderByCreatedAtDesc(String reviewerId);
    boolean existsByBookingIdAndReviewerId(String bookingId, String reviewerId);
}
