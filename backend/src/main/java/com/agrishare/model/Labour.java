package com.agrishare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "labour")
public class Labour {
    @Id
    private String id;

    private String fullName;
    private List<String> skills = new ArrayList<>(); // Harvesting, Sowing, Weeding, Irrigation, Spraying, Ploughing, General farm work
    private Double dailyWage;
    private Integer experienceYears;
    private Integer crewSize = 1; // 1 for individual, or crew of 5, 10 etc.
    private String gender; // Male, Female, Mixed Crew
    private String bio;

    private String address;
    private String city;
    private String state;
    private Double latitude;
    private Double longitude;

    private String contactPhone;
    private String avatarUrl;

    private boolean available = true;
    private Double rating = 4.8;
    private Integer reviewCount = 0;
    private Instant createdAt = Instant.now();

    public Labour() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public Double getDailyWage() { return dailyWage; }
    public void setDailyWage(Double dailyWage) { this.dailyWage = dailyWage; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public Integer getCrewSize() { return crewSize; }
    public void setCrewSize(Integer crewSize) { this.crewSize = crewSize; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

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

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
