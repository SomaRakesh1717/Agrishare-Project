package com.agrishare.controller;

import com.agrishare.model.Review;
import com.agrishare.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        try {
            Review saved = reviewService.createReview(authentication.getName(), review);
            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/target/{targetType}/{targetId}")
    public ResponseEntity<List<Review>> getReviewsForTarget(@PathVariable String targetType, @PathVariable String targetId) {
        return ResponseEntity.ok(reviewService.getReviewsForTarget(targetType, targetId));
    }
}
