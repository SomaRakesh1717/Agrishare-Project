package com.agrishare.controller;

import com.agrishare.model.Seed;
import com.agrishare.model.User;
import com.agrishare.service.AuthService;
import com.agrishare.service.SeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seeds")
public class SeedController {

    private final SeedService seedService;
    private final AuthService authService;

    public SeedController(SeedService seedService, AuthService authService) {
        this.seedService = seedService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Seed>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String cropType,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean availableOnly) {
        return ResponseEntity.ok(seedService.getAll(search, cropType, maxPrice, location, availableOnly));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Seed>> getNearby(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "50") double maxDistanceKm) {
        return ResponseEntity.ok(seedService.getNearby(lat, lon, maxDistanceKm));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(seedService.getById(id));
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Seed seed, Authentication authentication) {
        try {
            if (authentication != null) {
                User user = authService.getUserByEmail(authentication.getName());
                seed.setSellerId(user.getId());
                seed.setSellerName(user.getName());
                seed.setSellerPhone(user.getPhone());
                if (seed.getLatitude() == null) seed.setLatitude(user.getLatitude());
                if (seed.getLongitude() == null) seed.setLongitude(user.getLongitude());
            }
            Seed saved = seedService.create(seed);
            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Seed seed) {
        try {
            return ResponseEntity.ok(seedService.update(id, seed));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            seedService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Seed variety deleted successfully"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
