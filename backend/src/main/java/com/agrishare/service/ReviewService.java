package com.agrishare.service;

import com.agrishare.model.*;
import com.agrishare.repository.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final MachineryRepository machineryRepository;
    private final LabourRepository labourRepository;
    private final OperatorRepository operatorRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         UserRepository userRepository,
                         MachineryRepository machineryRepository,
                         LabourRepository labourRepository,
                         OperatorRepository operatorRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.machineryRepository = machineryRepository;
        this.labourRepository = labourRepository;
        this.operatorRepository = operatorRepository;
    }

    public Review createReview(String userEmail, Review reviewRequest) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (reviewRequest.getBookingId() != null && !reviewRequest.getBookingId().isBlank()) {
            if (reviewRepository.existsByBookingIdAndReviewerId(reviewRequest.getBookingId(), user.getId())) {
                throw new RuntimeException("You have already reviewed this booking");
            }
        }

        reviewRequest.setReviewerId(user.getId());
        reviewRequest.setReviewerName(user.getName());
        reviewRequest.setReviewerAvatar(user.getAvatarUrl());
        reviewRequest.setCreatedAt(Instant.now());

        Review saved = reviewRepository.save(reviewRequest);

        // Recalculate target rating
        updateTargetAverageRating(reviewRequest.getTargetType(), reviewRequest.getTargetId());

        return saved;
    }

    public List<Review> getReviewsForTarget(String targetType, String targetId) {
        return reviewRepository.findByTargetTypeAndTargetIdOrderByCreatedAtDesc(targetType.toUpperCase(), targetId);
    }

    private void updateTargetAverageRating(String targetType, String targetId) {
        if (targetId == null || targetType == null) return;

        List<Review> reviews = reviewRepository.findByTargetTypeAndTargetIdOrderByCreatedAtDesc(targetType.toUpperCase(), targetId);
        if (reviews.isEmpty()) return;

        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
        double rounded = Math.round(avg * 10.0) / 10.0;

        switch (targetType.toUpperCase()) {
            case "MACHINERY":
                machineryRepository.findById(targetId).ifPresent(m -> {
                    m.setRating(rounded);
                    m.setReviewCount(reviews.size());
                    machineryRepository.save(m);
                });
                break;
            case "LABOUR":
                labourRepository.findById(targetId).ifPresent(l -> {
                    l.setRating(rounded);
                    l.setReviewCount(reviews.size());
                    labourRepository.save(l);
                });
                break;
            case "OPERATOR":
                operatorRepository.findById(targetId).ifPresent(o -> {
                    o.setRating(rounded);
                    o.setReviewCount(reviews.size());
                    operatorRepository.save(o);
                });
                break;
        }
    }
}
