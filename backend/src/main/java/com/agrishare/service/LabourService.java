package com.agrishare.service;

import com.agrishare.model.Labour;
import com.agrishare.repository.LabourRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LabourService {

    private final LabourRepository labourRepository;

    public LabourService(LabourRepository labourRepository) {
        this.labourRepository = labourRepository;
    }

    public List<Labour> getAll(String search, String skill, Double maxWage, String location, Boolean availableOnly) {
        List<Labour> list = labourRepository.findAll();

        return list.stream()
                .filter(l -> {
                    if (search != null && !search.isBlank()) {
                        String query = search.toLowerCase();
                        boolean match = (l.getFullName() != null && l.getFullName().toLowerCase().contains(query)) ||
                                        (l.getBio() != null && l.getBio().toLowerCase().contains(query)) ||
                                        (l.getSkills() != null && l.getSkills().stream().anyMatch(s -> s.toLowerCase().contains(query)));
                        if (!match) return false;
                    }
                    if (skill != null && !skill.isBlank() && !skill.equalsIgnoreCase("all")) {
                        if (l.getSkills() == null || l.getSkills().stream().noneMatch(s -> s.equalsIgnoreCase(skill))) {
                            return false;
                        }
                    }
                    if (maxWage != null && maxWage > 0) {
                        if (l.getDailyWage() != null && l.getDailyWage() > maxWage) {
                            return false;
                        }
                    }
                    if (location != null && !location.isBlank()) {
                        String loc = location.toLowerCase();
                        boolean match = (l.getCity() != null && l.getCity().toLowerCase().contains(loc)) ||
                                        (l.getAddress() != null && l.getAddress().toLowerCase().contains(loc)) ||
                                        (l.getState() != null && l.getState().toLowerCase().contains(loc));
                        if (!match) return false;
                    }
                    if (Boolean.TRUE.equals(availableOnly)) {
                        if (!l.isAvailable()) return false;
                    }
                    return true;
                })
                .sorted(Comparator.comparing(Labour::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<Labour> getNearby(double userLat, double userLon, double maxDistanceKm) {
        return labourRepository.findAll().stream()
                .filter(l -> l.getLatitude() != null && l.getLongitude() != null)
                .filter(l -> MachineryService.calculateDistanceKm(userLat, userLon, l.getLatitude(), l.getLongitude()) <= maxDistanceKm)
                .sorted(Comparator.comparingDouble(l -> MachineryService.calculateDistanceKm(userLat, userLon, l.getLatitude(), l.getLongitude())))
                .collect(Collectors.toList());
    }

    public Labour getById(String id) {
        return labourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Labour profile not found with id: " + id));
    }

    public Labour create(Labour labour) {
        return labourRepository.save(labour);
    }

    public Labour update(String id, Labour updated) {
        Labour existing = getById(id);
        if (updated.getFullName() != null) existing.setFullName(updated.getFullName());
        if (updated.getSkills() != null && !updated.getSkills().isEmpty()) existing.setSkills(updated.getSkills());
        if (updated.getDailyWage() != null) existing.setDailyWage(updated.getDailyWage());
        if (updated.getExperienceYears() != null) existing.setExperienceYears(updated.getExperienceYears());
        if (updated.getCrewSize() != null) existing.setCrewSize(updated.getCrewSize());
        if (updated.getGender() != null) existing.setGender(updated.getGender());
        if (updated.getBio() != null) existing.setBio(updated.getBio());
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress());
        if (updated.getCity() != null) existing.setCity(updated.getCity());
        if (updated.getState() != null) existing.setState(updated.getState());
        if (updated.getLatitude() != null) existing.setLatitude(updated.getLatitude());
        if (updated.getLongitude() != null) existing.setLongitude(updated.getLongitude());
        if (updated.getContactPhone() != null) existing.setContactPhone(updated.getContactPhone());
        if (updated.getAvatarUrl() != null) existing.setAvatarUrl(updated.getAvatarUrl());
        existing.setAvailable(updated.isAvailable());
        return labourRepository.save(existing);
    }

    public void delete(String id) {
        labourRepository.deleteById(id);
    }
}
