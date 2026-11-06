package com.agrishare.controller;

import com.agrishare.model.Operator;
import com.agrishare.service.OperatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/operators")
public class OperatorController {

    private final OperatorService operatorService;

    public OperatorController(OperatorService operatorService) {
        this.operatorService = operatorService;
    }

    @GetMapping
    public ResponseEntity<List<Operator>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String expertise,
            @RequestParam(required = false) Double maxWage,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean availableOnly) {
        return ResponseEntity.ok(operatorService.getAll(search, expertise, maxWage, location, availableOnly));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Operator>> getNearby(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "50") double maxDistanceKm) {
        return ResponseEntity.ok(operatorService.getNearby(lat, lon, maxDistanceKm));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(operatorService.getById(id));
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Operator operator) {
        try {
            Operator saved = operatorService.create(operator);
            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Operator operator) {
        try {
            return ResponseEntity.ok(operatorService.update(id, operator));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            operatorService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Operator deleted successfully"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
