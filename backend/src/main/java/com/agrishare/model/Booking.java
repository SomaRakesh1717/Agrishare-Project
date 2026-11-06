package com.agrishare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;

    private String bookingNumber; // e.g. AGR-8821
    private String resourceType; // MACHINERY, SEEDS, LABOUR, OPERATOR
    private String resourceId;
    private String resourceTitle;
    private String resourceImage;

    private String bookedByUserId;
    private String bookedByUserName;
    private String bookedByUserEmail;
    private String bookedByUserPhone;

    private String ownerOrProviderId;
    private String ownerOrProviderName;
    private String ownerOrProviderPhone;

    private LocalDate startDate;
    private LocalDate endDate;
    private Double quantity; // For seeds in kg, or machinery in hours/days
    private String rentalDurationUnit; // DAYS, HOURS, KG

    private Double totalPrice;
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED

    private String deliveryAddress;
    private String notes;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public Booking() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBookingNumber() { return bookingNumber; }
    public void setBookingNumber(String bookingNumber) { this.bookingNumber = bookingNumber; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getResourceTitle() { return resourceTitle; }
    public void setResourceTitle(String resourceTitle) { this.resourceTitle = resourceTitle; }

    public String getResourceImage() { return resourceImage; }
    public void setResourceImage(String resourceImage) { this.resourceImage = resourceImage; }

    public String getBookedByUserId() { return bookedByUserId; }
    public void setBookedByUserId(String bookedByUserId) { this.bookedByUserId = bookedByUserId; }

    public String getBookedByUserName() { return bookedByUserName; }
    public void setBookedByUserName(String bookedByUserName) { this.bookedByUserName = bookedByUserName; }

    public String getBookedByUserEmail() { return bookedByUserEmail; }
    public void setBookedByUserEmail(String bookedByUserEmail) { this.bookedByUserEmail = bookedByUserEmail; }

    public String getBookedByUserPhone() { return bookedByUserPhone; }
    public void setBookedByUserPhone(String bookedByUserPhone) { this.bookedByUserPhone = bookedByUserPhone; }

    public String getOwnerOrProviderId() { return ownerOrProviderId; }
    public void setOwnerOrProviderId(String ownerOrProviderId) { this.ownerOrProviderId = ownerOrProviderId; }

    public String getOwnerOrProviderName() { return ownerOrProviderName; }
    public void setOwnerOrProviderName(String ownerOrProviderName) { this.ownerOrProviderName = ownerOrProviderName; }

    public String getOwnerOrProviderPhone() { return ownerOrProviderPhone; }
    public void setOwnerOrProviderPhone(String ownerOrProviderPhone) { this.ownerOrProviderPhone = ownerOrProviderPhone; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getRentalDurationUnit() { return rentalDurationUnit; }
    public void setRentalDurationUnit(String rentalDurationUnit) { this.rentalDurationUnit = rentalDurationUnit; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
