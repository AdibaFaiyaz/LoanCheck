package com.loan.controller;

import com.loan.entity.LoanApplication;
import com.loan.entity.User;
import com.loan.service.LoanApplicationService;
import com.loan.service.LoanEligibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // TODO: Restrict origins in production
@Validated
public class LoanController {
    
    @Autowired
    private LoanEligibilityService eligibilityService;
    
    @Autowired
    private LoanApplicationService applicationService;

    // 1. Check Eligibility Endpoint (without saving application)
    @PostMapping("/check-eligibility")
    public ResponseEntity<?> checkEligibility(@Valid @RequestBody EligibilityRequestDTO request) {
        try {
            // Convert DTO to service request
            LoanEligibilityService.EligibilityRequest serviceRequest = new LoanEligibilityService.EligibilityRequest(
                request.getName(),
                request.getAge(),
                request.getAnnualIncome(),
                request.getCreditScore(),
                request.getMonthlyDebtPayments(),
                request.getRequestedAmount(),
                request.getLoanTenure(),
                request.getEmploymentType()
            );
            
            // Check eligibility
            LoanEligibilityService.EligibilityResult result = eligibilityService.checkEligibility(serviceRequest);
            
            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("eligible", result.isEligible());
            response.put("reason", result.getReason());
            response.put("maxLoanAmount", result.getMaxLoanAmount());
            response.put("approvedAmount", result.getApprovedAmount());
            response.put("interestRate", result.getInterestRate());
            response.put("monthlyEmi", result.getMonthlyEmi());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to check eligibility");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // 2. Save Application Endpoint (FIXED)
    @PostMapping("/save-application")
    public ResponseEntity<?> saveApplication(@Valid @RequestBody SaveApplicationRequestDTO request) {
        try {
            // Convert DTO to service request
            LoanApplicationService.LoanApplicationRequest serviceRequest = new LoanApplicationService.LoanApplicationRequest();
            
            // Basic info (FIXED: Now including email and phone)
            serviceRequest.setName(request.getName());
            serviceRequest.setEmail(request.getEmail()); // FIXED: Uncommented
            serviceRequest.setPhone(request.getPhone()); // FIXED: Uncommented
            serviceRequest.setAge(request.getAge());
            serviceRequest.setAnnualIncome(request.getAnnualIncome());
            serviceRequest.setCreditScore(request.getCreditScore());
            serviceRequest.setMonthlyDebtPayments(request.getMonthlyDebtPayments());
            serviceRequest.setRequestedAmount(request.getRequestedAmount());
            serviceRequest.setLoanTenure(request.getLoanTenure());
            serviceRequest.setEmploymentType(request.getEmploymentType());
            serviceRequest.setLoanPurpose(request.getLoanPurpose());
            
            // Eligibility results
            serviceRequest.setEligible(request.isEligible());
            serviceRequest.setEligibilityReason(request.getEligibilityReason());
            serviceRequest.setApprovedAmount(request.getApprovedAmount());
            serviceRequest.setInterestRate(request.getInterestRate());
            serviceRequest.setMonthlyEmi(request.getMonthlyEmi());
            
            // Save application
            LoanApplication savedApplication = applicationService.saveApplication(serviceRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Application saved successfully");
            response.put("applicationId", savedApplication.getId());
            response.put("status", savedApplication.getStatus());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to save application");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // 3. Check Eligibility AND Save Application (NEW ENDPOINT)
    @PostMapping("/check-eligibility-and-save")
    public ResponseEntity<?> checkEligibilityAndSave(@Valid @RequestBody SaveApplicationRequestDTO request) {
        try {
            // First, check eligibility
            LoanEligibilityService.EligibilityRequest eligibilityRequest = new LoanEligibilityService.EligibilityRequest(
                request.getName(),
                request.getAge(),
                request.getAnnualIncome(),
                request.getCreditScore(),
                request.getMonthlyDebtPayments(),
                request.getRequestedAmount(),
                request.getLoanTenure(),
                request.getEmploymentType()
            );
            
            LoanEligibilityService.EligibilityResult eligibilityResult = eligibilityService.checkEligibility(eligibilityRequest);
            
            // Then save the application with complete data
            LoanApplicationService.LoanApplicationRequest appRequest = new LoanApplicationService.LoanApplicationRequest();
            appRequest.setName(request.getName());
            appRequest.setEmail(request.getEmail());
            appRequest.setPhone(request.getPhone());
            appRequest.setAge(request.getAge());
            appRequest.setAnnualIncome(request.getAnnualIncome());
            appRequest.setCreditScore(request.getCreditScore());
            appRequest.setMonthlyDebtPayments(request.getMonthlyDebtPayments());
            appRequest.setRequestedAmount(request.getRequestedAmount());
            appRequest.setLoanTenure(request.getLoanTenure());
            appRequest.setEmploymentType(request.getEmploymentType());
            appRequest.setLoanPurpose(request.getLoanPurpose());
            appRequest.setEligible(eligibilityResult.isEligible());
            appRequest.setEligibilityReason(eligibilityResult.getReason());
            appRequest.setApprovedAmount(eligibilityResult.getApprovedAmount());
            appRequest.setInterestRate(eligibilityResult.getInterestRate());
            appRequest.setMonthlyEmi(eligibilityResult.getMonthlyEmi());
            
            LoanApplication savedApplication = applicationService.saveApplication(appRequest);
            
            // Create comprehensive response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("eligible", eligibilityResult.isEligible());
            response.put("reason", eligibilityResult.getReason());
            response.put("maxLoanAmount", eligibilityResult.getMaxLoanAmount());
            response.put("approvedAmount", eligibilityResult.getApprovedAmount());
            response.put("interestRate", eligibilityResult.getInterestRate());
            response.put("monthlyEmi", eligibilityResult.getMonthlyEmi());
            response.put("applicationId", savedApplication.getId());
            response.put("applicationStatus", savedApplication.getStatus());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to process application");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // 4. Get Applications by Email
    @GetMapping("/get-applications")
    public ResponseEntity<?> getApplications(@RequestParam String email) {
        try {
            List<LoanApplication> applications = applicationService.getApplicationsByEmail(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("applications", applications);
            response.put("count", applications.size());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to retrieve applications");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // 5. Get All Applications (Admin)
    @GetMapping("/admin/applications")
    public ResponseEntity<?> getAllApplications() {
        try {
            List<LoanApplication> applications = applicationService.getAllApplications();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("applications", applications);
            response.put("count", applications.size());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to retrieve applications");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // 6. Get Application by ID
    @GetMapping("/application/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable String id) {
        try {
            Optional<LoanApplication> application = applicationService.getApplicationById(id);
            
            if (application.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("application", application.get());
                response.put("timestamp", System.currentTimeMillis());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Application not found");
                errorResponse.put("message", "No application found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to retrieve application");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // 7. Update Application Status (Admin)
    @PutMapping("/admin/application/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable String id, @RequestBody Map<String, String> statusUpdate) {
        try {
            String newStatus = statusUpdate.get("status");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Status is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            
            LoanApplication updatedApplication = applicationService.updateApplicationStatus(id, newStatus.toUpperCase());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Application status updated successfully");
            response.put("application", updatedApplication);
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Application not found");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to update application status");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // 8. Get Application Statistics (Admin)
    @GetMapping("/admin/stats")
    public ResponseEntity<?> getApplicationStats() {
        try {
            LoanApplicationService.ApplicationStats stats = applicationService.getApplicationStats();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to retrieve statistics");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // 9. Get User by Email
    @GetMapping("/user")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        try {
            User user = applicationService.getUserByEmail(email);
            
            if (user != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("user", user);
                response.put("timestamp", System.currentTimeMillis());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "User not found");
                errorResponse.put("message", "No user found with email: " + email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to retrieve user");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // 10. Health Check Endpoint
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Loan Eligibility API is running");
        response.put("timestamp", System.currentTimeMillis());
        response.put("version", "1.0.0");
        
        return ResponseEntity.ok(response);
    }

    // DTO Classes for Request/Response
    public static class EligibilityRequestDTO {
        @NotBlank(message = "Name is required")
        private String name;
        
        @Min(value = 18, message = "Age must be at least 18")
        @Max(value = 65, message = "Age must be at most 65")
        private int age;
        
        @Min(value = 0, message = "Annual income must be positive")
        private double annualIncome;
        
        @Min(value = 300, message = "Credit score must be at least 300")
        @Max(value = 850, message = "Credit score must be at most 850")
        private int creditScore;
        
        @Min(value = 0, message = "Monthly debt payments cannot be negative")
        private double monthlyDebtPayments;
        
        @Min(value = 1000, message = "Requested amount must be at least 1000")
        private double requestedAmount;
        
        @Min(value = 6, message = "Loan tenure must be at least 6 months")
        @Max(value = 360, message = "Loan tenure must be at most 360 months")
        private int loanTenure;
        
        @NotBlank(message = "Employment type is required")
        private String employmentType;
        
        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public int getAge() { return age; }
        public void setAge(int age) { this.age = age; }
        
        public double getAnnualIncome() { return annualIncome; }
        public void setAnnualIncome(double annualIncome) { this.annualIncome = annualIncome; }
        
        public int getCreditScore() { return creditScore; }
        public void setCreditScore(int creditScore) { this.creditScore = creditScore; }
        
        public double getMonthlyDebtPayments() { return monthlyDebtPayments; }
        public void setMonthlyDebtPayments(double monthlyDebtPayments) { this.monthlyDebtPayments = monthlyDebtPayments; }
        
        public double getRequestedAmount() { return requestedAmount; }
        public void setRequestedAmount(double requestedAmount) { this.requestedAmount = requestedAmount; }
        
        public int getLoanTenure() { return loanTenure; }
        public void setLoanTenure(int loanTenure) { this.loanTenure = loanTenure; }
        
        public String getEmploymentType() { return employmentType; }
        public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
    }
    
    public static class SaveApplicationRequestDTO extends EligibilityRequestDTO {
        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        private String email;
        
        @NotBlank(message = "Phone is required")
        private String phone;
        
        private String loanPurpose;
        
        // Eligibility results (optional for the new combined endpoint)
        private boolean eligible;
        private String eligibilityReason;
        private double approvedAmount;
        private double interestRate;
        private double monthlyEmi;
        
        // Getters and Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        
        public String getLoanPurpose() { return loanPurpose; }
        public void setLoanPurpose(String loanPurpose) { this.loanPurpose = loanPurpose; }
        
        public boolean isEligible() { return eligible; }
        public void setEligible(boolean eligible) { this.eligible = eligible; }
        
        public String getEligibilityReason() { return eligibilityReason; }
        public void setEligibilityReason(String eligibilityReason) { this.eligibilityReason = eligibilityReason; }
        
        public double getApprovedAmount() { return approvedAmount; }
        public void setApprovedAmount(double approvedAmount) { this.approvedAmount = approvedAmount; }
        
        public double getInterestRate() { return interestRate; }
        public void setInterestRate(double interestRate) { this.interestRate = interestRate; }
        
        public double getMonthlyEmi() { return monthlyEmi; }
        public void setMonthlyEmi(double monthlyEmi) { this.monthlyEmi = monthlyEmi; }
    }
}