package com.agrishare.dto;

import java.time.LocalDate;

public class BookingDto {

    public static class CreateBookingRequest {
        private String resourceType; // MACHINERY, SEEDS, LABOUR, OPERATOR
        private String resourceId;
        private LocalDate startDate;
        private LocalDate endDate;
        private Double quantity; // kg for seeds, or hours/days
        private String rentalDurationUnit;
        private String deliveryAddress;
        private String notes;

        public CreateBookingRequest() {}

        public String getResourceType() { return resourceType; }
        public void setResourceType(String resourceType) { this.resourceType = resourceType; }
        public String getResourceId() { return resourceId; }
        public void setResourceId(String resourceId) { this.resourceId = resourceId; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public Double getQuantity() { return quantity; }
        public void setQuantity(Double quantity) { this.quantity = quantity; }
        public String getRentalDurationUnit() { return rentalDurationUnit; }
        public void setRentalDurationUnit(String rentalDurationUnit) { this.rentalDurationUnit = rentalDurationUnit; }
        public String getDeliveryAddress() { return deliveryAddress; }
        public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class UpdateStatusRequest {
        private String status; // PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED

        public UpdateStatusRequest() {}
        public UpdateStatusRequest(String status) { this.status = status; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
