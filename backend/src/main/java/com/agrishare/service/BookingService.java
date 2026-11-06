package com.agrishare.service;

import com.agrishare.dto.BookingDto;
import com.agrishare.model.*;
import com.agrishare.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final MachineryRepository machineryRepository;
    private final SeedRepository seedRepository;
    private final LabourRepository labourRepository;
    private final OperatorRepository operatorRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          MachineryRepository machineryRepository,
                          SeedRepository seedRepository,
                          LabourRepository labourRepository,
                          OperatorRepository operatorRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.machineryRepository = machineryRepository;
        this.seedRepository = seedRepository;
        this.labourRepository = labourRepository;
        this.operatorRepository = operatorRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Booking createBooking(BookingDto.CreateBookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        String resourceType = request.getResourceType() != null ? request.getResourceType().toUpperCase() : "MACHINERY";
        String resourceId = request.getResourceId();

        if (resourceId == null || resourceId.isBlank()) {
            throw new RuntimeException("Resource ID is required for booking");
        }

        Booking booking = new Booking();
        booking.setBookingNumber("AGR-" + (1000 + new Random().nextInt(9000)));
        booking.setResourceType(resourceType);
        booking.setResourceId(resourceId);
        booking.setBookedByUserId(user.getId());
        booking.setBookedByUserName(user.getName());
        booking.setBookedByUserEmail(user.getEmail());
        booking.setBookedByUserPhone(user.getPhone() != null ? user.getPhone() : "+91 98480 12345");
        booking.setDeliveryAddress(request.getDeliveryAddress() != null ? request.getDeliveryAddress() : user.getAddress());
        booking.setNotes(request.getNotes());
        booking.setStartDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now());
        booking.setEndDate(request.getEndDate() != null ? request.getEndDate() : booking.getStartDate());
        booking.setStatus("PENDING");

        long days = Math.max(1, ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) + 1);

        User admin = userRepository.findByEmail("admin@agrishare.com").orElse(null);
        String defaultAdminId = admin != null ? admin.getId() : "admin";
        String defaultAdminPhone = admin != null ? admin.getPhone() : "+91 98480 99999";

        switch (resourceType) {
            case "MACHINERY":
                Machinery machinery = machineryRepository.findById(resourceId)
                        .orElseThrow(() -> new RuntimeException("Machinery not found"));
                if (!machinery.isAvailable()) {
                    throw new RuntimeException("This machinery is currently unavailable for booking");
                }
                // Check conflicting booking dates
                List<Booking> conflicts = bookingRepository.findConflictingBookings(
                        resourceId, booking.getStartDate(), booking.getEndDate());
                if (!conflicts.isEmpty()) {
                    throw new RuntimeException("Machinery is already booked for the selected date range. Please choose another date.");
                }

                booking.setResourceTitle(machinery.getTitle());
                if (machinery.getImages() != null && !machinery.getImages().isEmpty()) {
                    booking.setResourceImage(machinery.getImages().get(0));
                }
                booking.setOwnerOrProviderId(machinery.getOwnerId() != null ? machinery.getOwnerId() : defaultAdminId);
                booking.setOwnerOrProviderName(machinery.getOwnerName() != null ? machinery.getOwnerName() : "AgriShare Admin");
                booking.setOwnerOrProviderPhone(machinery.getOwnerPhone() != null ? machinery.getOwnerPhone() : defaultAdminPhone);
                booking.setQuantity((double) days);
                booking.setRentalDurationUnit("DAYS");
                booking.setTotalPrice(machinery.getPricePerDay() != null ? machinery.getPricePerDay() * days : 2500.0 * days);
                break;

            case "SEEDS":
                Seed seed = seedRepository.findById(resourceId)
                        .orElseThrow(() -> new RuntimeException("Seed variety not found"));
                if (!seed.isAvailable()) {
                    throw new RuntimeException("This seed variety is currently unavailable");
                }
                double requestedQty = request.getQuantity() != null && request.getQuantity() > 0 ? request.getQuantity() : 10.0;
                if (seed.getStockKg() != null && seed.getStockKg() < requestedQty) {
                    throw new RuntimeException("Requested quantity (" + requestedQty + " kg) exceeds available stock (" + seed.getStockKg() + " kg)");
                }
                // Deduct stock upon booking
                if (seed.getStockKg() != null) {
                    seed.setStockKg(seed.getStockKg() - requestedQty);
                    if (seed.getStockKg() <= 0) {
                        seed.setAvailable(false);
                    }
                    seedRepository.save(seed);
                }

                booking.setResourceTitle(seed.getName() + " (" + seed.getVariety() + ")");
                booking.setResourceImage(seed.getImageUrl());
                booking.setOwnerOrProviderId(seed.getSellerId() != null ? seed.getSellerId() : defaultAdminId);
                booking.setOwnerOrProviderName(seed.getSellerName() != null ? seed.getSellerName() : "AgriShare Admin");
                booking.setOwnerOrProviderPhone(seed.getSellerPhone() != null ? seed.getSellerPhone() : defaultAdminPhone);
                booking.setQuantity(requestedQty);
                booking.setRentalDurationUnit("KG");
                booking.setTotalPrice(seed.getPricePerKg() != null ? seed.getPricePerKg() * requestedQty : 150.0 * requestedQty);
                break;

            case "LABOUR":
                Labour labour = labourRepository.findById(resourceId)
                        .orElseThrow(() -> new RuntimeException("Labour profile not found"));
                if (!labour.isAvailable()) {
                    throw new RuntimeException("This labour crew is currently unavailable for hire");
                }
                booking.setResourceTitle(labour.getFullName() + " (Crew of " + labour.getCrewSize() + ")");
                booking.setResourceImage(labour.getAvatarUrl());
                booking.setOwnerOrProviderId(defaultAdminId);
                booking.setOwnerOrProviderName("AgriShare Admin");
                booking.setOwnerOrProviderPhone(defaultAdminPhone);
                booking.setQuantity((double) days);
                booking.setRentalDurationUnit("DAYS");
                booking.setTotalPrice(labour.getDailyWage() != null ? labour.getDailyWage() * days : 600.0 * days);
                break;

            case "OPERATOR":
                Operator operator = operatorRepository.findById(resourceId)
                        .orElseThrow(() -> new RuntimeException("Operator profile not found"));
                if (!operator.isAvailable()) {
                    throw new RuntimeException("This operator is currently unavailable for hire");
                }
                booking.setResourceTitle(operator.getFullName() + " (Machinery Specialist)");
                booking.setResourceImage(operator.getAvatarUrl());
                booking.setOwnerOrProviderId(defaultAdminId);
                booking.setOwnerOrProviderName("AgriShare Admin");
                booking.setOwnerOrProviderPhone(defaultAdminPhone);
                booking.setQuantity((double) days);
                booking.setRentalDurationUnit("DAYS");
                booking.setTotalPrice(operator.getDailyWage() != null ? operator.getDailyWage() * days : 900.0 * days);
                break;

            default:
                throw new RuntimeException("Unknown resource type: " + resourceType);
        }

        booking.setCreatedAt(Instant.now());
        booking.setUpdatedAt(Instant.now());
        return bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));
        return bookingRepository.findByBookedByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public List<Booking> getOwnerBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));
        return bookingRepository.findByOwnerOrProviderIdOrderByCreatedAtDesc(user.getId());
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public Booking getById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public Booking updateStatus(String id, String status) {
        Booking booking = getById(id);
        String upperStatus = status.toUpperCase();
        booking.setStatus(upperStatus);
        booking.setUpdatedAt(Instant.now());

        // If cancelled or rejected and was seed, restore stock
        if (("CANCELLED".equals(upperStatus) || "REJECTED".equals(upperStatus)) && "SEEDS".equals(booking.getResourceType())) {
            seedRepository.findById(booking.getResourceId()).ifPresent(seed -> {
                if (booking.getQuantity() != null && seed.getStockKg() != null) {
                    seed.setStockKg(seed.getStockKg() + booking.getQuantity());
                    seed.setAvailable(true);
                    seedRepository.save(seed);
                }
            });
        }

        return bookingRepository.save(booking);
    }
}
