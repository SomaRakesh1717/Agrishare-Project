package com.agrishare.service;

import com.agrishare.model.Operator;
import com.agrishare.repository.OperatorRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OperatorService {

    private final OperatorRepository operatorRepository;

    public OperatorService(OperatorRepository operatorRepository) {
        this.operatorRepository = operatorRepository;
    }

    public List<Operator> getAll(String search, String expertise, Double maxWage, String location, Boolean availableOnly) {
        List<Operator> list = operatorRepository.findAll();

        return list.stream()
                .filter(o -> {
                    if (search != null && !search.isBlank()) {
                        String query = search.toLowerCase();
                        boolean match = (o.getFullName() != null && o.getFullName().toLowerCase().contains(query)) ||
                                        (o.getBio() != null && o.getBio().toLowerCase().contains(query)) ||
                                        (o.getMachineryExpertise() != null && o.getMachineryExpertise().stream().anyMatch(e -> e.toLowerCase().contains(query)));
                        if (!match) return false;
                    }
                    if (expertise != null && !expertise.isBlank() && !expertise.equalsIgnoreCase("all")) {
                        if (o.getMachineryExpertise() == null || o.getMachineryExpertise().stream().noneMatch(e -> e.equalsIgnoreCase(expertise))) {
                            return false;
                        }
                    }
                    if (maxWage != null && maxWage > 0) {
                        if (o.getDailyWage() != null && o.getDailyWage() > maxWage) {
                            return false;
                        }
                    }
                    if (location != null && !location.isBlank()) {
                        String loc = location.toLowerCase();
                        boolean match = (o.getCity() != null && o.getCity().toLowerCase().contains(loc)) ||
                                        (o.getAddress() != null && o.getAddress().toLowerCase().contains(loc)) ||
                                        (o.getState() != null && o.getState().toLowerCase().contains(loc));
                        if (!match) return false;
                    }
                    if (Boolean.TRUE.equals(availableOnly)) {
                        if (!o.isAvailable()) return false;
                    }
                    return true;
                })
                .sorted(Comparator.comparing(Operator::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<Operator> getNearby(double userLat, double userLon, double maxDistanceKm) {
        return operatorRepository.findAll().stream()
                .filter(o -> o.getLatitude() != null && o.getLongitude() != null)
                .filter(o -> MachineryService.calculateDistanceKm(userLat, userLon, o.getLatitude(), o.getLongitude()) <= maxDistanceKm)
                .sorted(Comparator.comparingDouble(o -> MachineryService.calculateDistanceKm(userLat, userLon, o.getLatitude(), o.getLongitude())))
                .collect(Collectors.toList());
    }

    public Operator getById(String id) {
        return operatorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Operator not found with id: " + id));
    }

    public Operator create(Operator operator) {
        return operatorRepository.save(operator);
    }

    public Operator update(String id, Operator updated) {
        Operator existing = getById(id);
        if (updated.getFullName() != null) existing.setFullName(updated.getFullName());
        if (updated.getMachineryExpertise() != null && !updated.getMachineryExpertise().isEmpty()) existing.setMachineryExpertise(updated.getMachineryExpertise());
        if (updated.getDailyWage() != null) existing.setDailyWage(updated.getDailyWage());
        if (updated.getExperienceYears() != null) existing.setExperienceYears(updated.getExperienceYears());
        if (updated.getLicenseNumber() != null) existing.setLicenseNumber(updated.getLicenseNumber());
        if (updated.getBio() != null) existing.setBio(updated.getBio());
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress());
        if (updated.getCity() != null) existing.setCity(updated.getCity());
        if (updated.getState() != null) existing.setState(updated.getState());
        if (updated.getLatitude() != null) existing.setLatitude(updated.getLatitude());
        if (updated.getLongitude() != null) existing.setLongitude(updated.getLongitude());
        if (updated.getContactPhone() != null) existing.setContactPhone(updated.getContactPhone());
        if (updated.getAvatarUrl() != null) existing.setAvatarUrl(updated.getAvatarUrl());
        existing.setAvailable(updated.isAvailable());
        return operatorRepository.save(existing);
    }

    public void delete(String id) {
        operatorRepository.deleteById(id);
    }
}
