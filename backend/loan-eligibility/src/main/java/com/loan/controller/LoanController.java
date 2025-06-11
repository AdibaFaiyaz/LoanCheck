package com.loan.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;



@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LoanController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/test-db")
public ResponseEntity<Map<String, String>> testDatabase() {
    Map<String, String> response = new HashMap<>();
    try {
        String dbName = mongoTemplate.getDb().getName();
        response.put("status", "SUCCESS");
        response.put("message", "MongoDB connected successfully");
        response.put("database", dbName);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        response.put("status", "ERROR");
        response.put("message", "Database connection failed: " + e.getMessage());
        return ResponseEntity.status(500).body(response);
    }
}
    
    @GetMapping("/")
    public ResponseEntity<Map<String, String>> home() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to Loan Eligibility Portal API!");
        response.put("status", "Server is running successfully");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Loan Eligibility Service");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/check-eligibility")
    public ResponseEntity<Map<String, Object>> checkEligibility(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        // Extract loan application data
        String name = (String) request.get("name");
        Double income = Double.valueOf(request.get("income").toString());
        Double loanAmount = Double.valueOf(request.get("loanAmount").toString());
        Integer creditScore = Integer.valueOf(request.get("creditScore").toString());
        
        // Simple eligibility logic
        boolean isEligible = false;
        String reason = "";
        
        if (income >= 30000 && creditScore >= 650 && loanAmount <= (income * 5)) {
            isEligible = true;
            reason = "Congratulations! You are eligible for the loan.";
        } else if (income < 30000) {
            reason = "Income too low. Minimum required: ₹30,000";
        } else if (creditScore < 650) {
            reason = "Credit score too low. Minimum required: 650";
        } else if (loanAmount > (income * 5)) {
            reason = "Loan amount too high. Maximum allowed: 5x your annual income";
        }
        
        response.put("applicantName", name);
        response.put("eligible", isEligible);
        response.put("reason", reason);
        response.put("income", income);
        response.put("loanAmount", loanAmount);
        response.put("creditScore", creditScore);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/loan-types")
    public ResponseEntity<Map<String, Object>> getLoanTypes() {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> loanTypes = new HashMap<>();
        
        loanTypes.put("personal", "Personal Loan - 10-15% interest");
        loanTypes.put("home", "Home Loan - 7-9% interest");
        loanTypes.put("car", "Car Loan - 8-12% interest");
        loanTypes.put("education", "Education Loan - 6-10% interest");
        
        response.put("loanTypes", loanTypes);
        response.put("message", "Available loan types");
        
        return ResponseEntity.ok(response);
    }
}