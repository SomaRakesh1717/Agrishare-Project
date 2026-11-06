package com.agrishare.controller;

import com.agrishare.model.Labour;
import com.agrishare.service.LabourService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/labour")
public class LabourController {

    private final LabourService labourService;

    public LabourController(LabourService labourService) {
        this.labourService = labourService;
    }

    @GetMapping
    public ResponseEntity<List<Labour>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) Double maxWage,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean availableOnly) {
        return ResponseEntity.ok(labourService.getAll(search, skill, maxWage, location, availableOnly));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Labour>> getNearby(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "50") double maxDistanceKm) {
        return ResponseEntity.ok(labourService.getNearby(lat, lon, maxDistanceKm));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(labourService.getById(id));
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Labour labour) {
        try {
            Labour saved = labourService.create(labour);
            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Labour labour) {
        try {
            return ResponseEntity.ok(labourService.update(id, labour));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            labourService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Labour profile deleted successfully"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
