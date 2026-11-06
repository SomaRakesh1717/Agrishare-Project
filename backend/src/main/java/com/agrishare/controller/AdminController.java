package com.agrishare.controller;

import com.agrishare.model.User;
import com.agrishare.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final MachineryRepository machineryRepository;
    private final SeedRepository seedRepository;
    private final LabourRepository labourRepository;
    private final OperatorRepository operatorRepository;
    private final BookingRepository bookingRepository;

    public AdminController(UserRepository userRepository,
                           MachineryRepository machineryRepository,
                           SeedRepository seedRepository,
                           LabourRepository labourRepository,
                           OperatorRepository operatorRepository,
                           BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.machineryRepository = machineryRepository;
        this.seedRepository = seedRepository;
        this.labourRepository = labourRepository;
        this.operatorRepository = operatorRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalUsers = userRepository.count();
        long totalMachinery = machineryRepository.count();
        long totalSeeds = seedRepository.count();
        long totalLabour = labourRepository.count();
        long totalOperators = operatorRepository.count();
        long totalBookings = bookingRepository.count();

        stats.put("totalUsers", totalUsers);
        stats.put("totalMachinery", totalMachinery);
        stats.put("totalSeeds", totalSeeds);
        stats.put("totalLabour", totalLabour);
        stats.put("totalOperators", totalOperators);
        stats.put("totalBookings", totalBookings);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
