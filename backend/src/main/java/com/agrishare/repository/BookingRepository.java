package com.agrishare.repository;

import com.agrishare.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByBookedByUserIdOrderByCreatedAtDesc(String bookedByUserId);

    @Query(value = "{ 'ownerOrProviderId': ?0 }", sort = "{ 'createdAt': -1 }")
    List<Booking> findByOwnerOrProviderIdOrderByCreatedAtDesc(String ownerOrProviderId);

    List<Booking> findByStatusOrderByCreatedAtDesc(String status);
    List<Booking> findAllByOrderByCreatedAtDesc();

    @Query("{ 'resourceId': ?0, 'status': { $in: ['PENDING', 'ACCEPTED'] }, " +
           "'$or': [ " +
           "  { 'startDate': { $lte: ?2 }, 'endDate': { $gte: ?1 } } " +
           "] }")
    List<Booking> findConflictingBookings(String resourceId, LocalDate startDate, LocalDate endDate);
}
