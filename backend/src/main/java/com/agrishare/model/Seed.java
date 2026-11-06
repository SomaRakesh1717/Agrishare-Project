package com.agrishare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "seeds")
public class Seed {
    @Id
    private String id;

    private String name;
    private String cropType; // Rice, Wheat, Maize, Cotton, Tomato, Chilli, Groundnut, Soybean, Vegetable
    private String variety;
    private String description;
    private Double pricePerKg;
    private Double stockKg;
    private Double germinationRate; // e.g. 95%
    private Integer maturityDays;   // e.g. 120 days
    private String packageSize;    // e.g. "5 kg Bag", "25 kg Sack"

    private String address;
    private String city;
    private String state;
    private Double latitude;
    private Double longitude;

    private String sellerId;
    private String sellerName;
    private String sellerPhone;
    private String imageUrl;

    private boolean available = true;
    private Double rating = 4.9;
    private Integer reviewCount = 0;
    private Instant createdAt = Instant.now();

    public Seed() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCropType() { return cropType; }
    public void setCropType(String cropType) { this.cropType = cropType; }

    public String getVariety() { return variety; }
    public void setVariety(String variety) { this.variety = variety; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPricePerKg() { return pricePerKg; }
    public void setPricePerKg(Double pricePerKg) { this.pricePerKg = pricePerKg; }

    public Double getStockKg() { return stockKg; }
    public void setStockKg(Double stockKg) { this.stockKg = stockKg; }

    public Double getGerminationRate() { return germinationRate; }
    public void setGerminationRate(Double germinationRate) { this.germinationRate = germinationRate; }

    public Integer getMaturityDays() { return maturityDays; }
    public void setMaturityDays(Integer maturityDays) { this.maturityDays = maturityDays; }

    public String getPackageSize() { return packageSize; }
    public void setPackageSize(String packageSize) { this.packageSize = packageSize; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getSellerId() { return sellerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public String getSellerPhone() { return sellerPhone; }
    public void setSellerPhone(String sellerPhone) { this.sellerPhone = sellerPhone; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
