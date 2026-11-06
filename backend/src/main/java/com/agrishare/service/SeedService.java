package com.agrishare.service;

import com.agrishare.model.Seed;
import com.agrishare.repository.SeedRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeedService {

    private final SeedRepository seedRepository;

    public SeedService(SeedRepository seedRepository) {
        this.seedRepository = seedRepository;
    }

    public List<Seed> getAll(String search, String cropType, Double maxPrice, String location, Boolean availableOnly) {
        List<Seed> list = seedRepository.findAll();

        return list.stream()
                .filter(s -> {
                    if (search != null && !search.isBlank()) {
                        String query = search.toLowerCase();
                        boolean match = (s.getName() != null && s.getName().toLowerCase().contains(query)) ||
                                        (s.getVariety() != null && s.getVariety().toLowerCase().contains(query)) ||
                                        (s.getCropType() != null && s.getCropType().toLowerCase().contains(query)) ||
                                        (s.getDescription() != null && s.getDescription().toLowerCase().contains(query));
                        if (!match) return false;
                    }
                    if (cropType != null && !cropType.isBlank() && !cropType.equalsIgnoreCase("all")) {
                        if (s.getCropType() == null || !s.getCropType().equalsIgnoreCase(cropType)) {
                            return false;
                        }
                    }
                    if (maxPrice != null && maxPrice > 0) {
                        if (s.getPricePerKg() != null && s.getPricePerKg() > maxPrice) {
                            return false;
                        }
                    }
                    if (location != null && !location.isBlank()) {
                        String loc = location.toLowerCase();
                        boolean match = (s.getCity() != null && s.getCity().toLowerCase().contains(loc)) ||
                                        (s.getAddress() != null && s.getAddress().toLowerCase().contains(loc)) ||
                                        (s.getState() != null && s.getState().toLowerCase().contains(loc));
                        if (!match) return false;
                    }
                    if (Boolean.TRUE.equals(availableOnly)) {
                        if (!s.isAvailable() || (s.getStockKg() != null && s.getStockKg() <= 0)) return false;
                    }
                    return true;
                })
                .sorted(Comparator.comparing(Seed::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<Seed> getNearby(double userLat, double userLon, double maxDistanceKm) {
        return seedRepository.findAll().stream()
                .filter(s -> s.getLatitude() != null && s.getLongitude() != null)
                .filter(s -> MachineryService.calculateDistanceKm(userLat, userLon, s.getLatitude(), s.getLongitude()) <= maxDistanceKm)
                .sorted(Comparator.comparingDouble(s -> MachineryService.calculateDistanceKm(userLat, userLon, s.getLatitude(), s.getLongitude())))
                .collect(Collectors.toList());
    }

    public Seed getById(String id) {
        return seedRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seed not found with id: " + id));
    }

    public Seed create(Seed seed) {
        return seedRepository.save(seed);
    }

    public Seed update(String id, Seed updated) {
        Seed existing = getById(id);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getCropType() != null) existing.setCropType(updated.getCropType());
        if (updated.getVariety() != null) existing.setVariety(updated.getVariety());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getPricePerKg() != null) existing.setPricePerKg(updated.getPricePerKg());
        if (updated.getStockKg() != null) existing.setStockKg(updated.getStockKg());
        if (updated.getGerminationRate() != null) existing.setGerminationRate(updated.getGerminationRate());
        if (updated.getMaturityDays() != null) existing.setMaturityDays(updated.getMaturityDays());
        if (updated.getPackageSize() != null) existing.setPackageSize(updated.getPackageSize());
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress());
        if (updated.getCity() != null) existing.setCity(updated.getCity());
        if (updated.getState() != null) existing.setState(updated.getState());
        if (updated.getLatitude() != null) existing.setLatitude(updated.getLatitude());
        if (updated.getLongitude() != null) existing.setLongitude(updated.getLongitude());
        if (updated.getImageUrl() != null) existing.setImageUrl(updated.getImageUrl());
        existing.setAvailable(updated.isAvailable());
        return seedRepository.save(existing);
    }

    public void delete(String id) {
        seedRepository.deleteById(id);
    }
}
