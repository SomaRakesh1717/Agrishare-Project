package com.agrishare.controller;

import com.agrishare.model.Machinery;
import com.agrishare.model.User;
import com.agrishare.service.AuthService;
import com.agrishare.service.MachineryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/machinery")
public class MachineryController {

    private final MachineryService machineryService;
    private final AuthService authService;

    public MachineryController(MachineryService machineryService, AuthService authService) {
        this.machineryService = machineryService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Machinery>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean availableOnly) {
        return ResponseEntity.ok(machineryService.getAll(search, category, maxPrice, location, availableOnly));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Machinery>> getNearby(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "50") double maxDistanceKm) {
        return ResponseEntity.ok(machineryService.getNearby(lat, lon, maxDistanceKm));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(machineryService.getById(id));
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Machinery machinery, Authentication authentication) {
        try {
            if (authentication != null) {
                User user = authService.getUserByEmail(authentication.getName());
                machinery.setOwnerId(user.getId());
                machinery.setOwnerName(user.getName());
                machinery.setOwnerPhone(user.getPhone());
                if (machinery.getLatitude() == null) machinery.setLatitude(user.getLatitude());
                if (machinery.getLongitude() == null) machinery.setLongitude(user.getLongitude());
            }
            Machinery saved = machineryService.create(machinery);
            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Machinery machinery) {
        try {
            return ResponseEntity.ok(machineryService.update(id, machinery));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            machineryService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Machinery deleted successfully"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
