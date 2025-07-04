package com.loan.controller;

import com.loan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/db")
    public ResponseEntity<?> testDatabase() {
        try {
            long userCount = userRepository.count();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "OK");
            response.put("message", "Database connection successful");
            response.put("userCount", userCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("message", "Database connection failed: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping("/simple")
    public ResponseEntity<?> simpleTest() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Simple test successful");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
