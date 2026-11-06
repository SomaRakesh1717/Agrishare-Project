package com.agrishare.service;

import com.agrishare.model.Machinery;
import com.agrishare.repository.MachineryRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MachineryService {

    private final MachineryRepository machineryRepository;

    public MachineryService(MachineryRepository machineryRepository) {
        this.machineryRepository = machineryRepository;
    }

    public List<Machinery> getAll(String search, String category, Double maxPrice, String location, Boolean availableOnly) {
        List<Machinery> list = machineryRepository.findAll();

        return list.stream()
                .filter(m -> {
                    if (search != null && !search.isBlank()) {
                        String s = search.toLowerCase();
                        boolean match = (m.getTitle() != null && m.getTitle().toLowerCase().contains(s)) ||
                                        (m.getDescription() != null && m.getDescription().toLowerCase().contains(s)) ||
                                        (m.getCategory() != null && m.getCategory().toLowerCase().contains(s)) ||
                                        (m.getCity() != null && m.getCity().toLowerCase().contains(s));
                        if (!match) return false;
                    }
                    if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
                        if (m.getCategory() == null || !m.getCategory().equalsIgnoreCase(category)) {
                            return false;
                        }
                    }
                    if (maxPrice != null && maxPrice > 0) {
                        if (m.getPricePerDay() != null && m.getPricePerDay() > maxPrice) {
                            return false;
                        }
                    }
                    if (location != null && !location.isBlank()) {
                        String loc = location.toLowerCase();
                        boolean match = (m.getCity() != null && m.getCity().toLowerCase().contains(loc)) ||
                                        (m.getAddress() != null && m.getAddress().toLowerCase().contains(loc)) ||
                                        (m.getState() != null && m.getState().toLowerCase().contains(loc));
                        if (!match) return false;
                    }
                    if (Boolean.TRUE.equals(availableOnly)) {
                        if (!m.isAvailable()) return false;
                    }
                    return true;
                })
                .sorted(Comparator.comparing(Machinery::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<Machinery> getNearby(double userLat, double userLon, double maxDistanceKm) {
        return machineryRepository.findAll().stream()
                .filter(m -> m.getLatitude() != null && m.getLongitude() != null)
                .filter(m -> calculateDistanceKm(userLat, userLon, m.getLatitude(), m.getLongitude()) <= maxDistanceKm)
                .sorted(Comparator.comparingDouble(m -> calculateDistanceKm(userLat, userLon, m.getLatitude(), m.getLongitude())))
                .collect(Collectors.toList());
    }

    public Machinery getById(String id) {
        return machineryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Machinery item not found with id: " + id));
    }

    public Machinery create(Machinery machinery) {
        return machineryRepository.save(machinery);
    }

    public Machinery update(String id, Machinery updated) {
        Machinery existing = getById(id);
        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getHorsepower() != null) existing.setHorsepower(updated.getHorsepower());
        if (updated.getFuelType() != null) existing.setFuelType(updated.getFuelType());
        if (updated.getWorkingWidth() != null) existing.setWorkingWidth(updated.getWorkingWidth());
        if (updated.getPricePerDay() != null) existing.setPricePerDay(updated.getPricePerDay());
        if (updated.getPricePerHour() != null) existing.setPricePerHour(updated.getPricePerHour());
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress());
        if (updated.getCity() != null) existing.setCity(updated.getCity());
        if (updated.getState() != null) existing.setState(updated.getState());
        if (updated.getLatitude() != null) existing.setLatitude(updated.getLatitude());
        if (updated.getLongitude() != null) existing.setLongitude(updated.getLongitude());
        if (updated.getImages() != null && !updated.getImages().isEmpty()) existing.setImages(updated.getImages());
        existing.setAvailable(updated.isAvailable());
        return machineryRepository.save(existing);
    }

    public void delete(String id) {
        machineryRepository.deleteById(id);
    }

    public static double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
