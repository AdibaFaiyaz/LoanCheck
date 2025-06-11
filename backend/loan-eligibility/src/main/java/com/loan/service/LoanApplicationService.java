package com.loan.service;

import com.loan.entity.LoanApplication;
import com.loan.entity.User;
import com.loan.repository.LoanApplicationRepository;
import com.loan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public class LoanApplicationService {
    
    @Autowired
    private LoanApplicationRepository loanApplicationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public LoanApplication saveApplication(LoanApplicationRequest request) {
        // First, find or create user
        User user = findOrCreateUser(request.getEmail(), request.getName(), request.getPhone());
        
        // Create loan application
        LoanApplication application = new LoanApplication();
        application.setUserId(user.getId());
        application.setName(request.getName());
        application.setEmail(request.getEmail());
        application.setPhone(request.getPhone());
        application.setAge(request.getAge());
        application.setAnnualIncome(request.getAnnualIncome());
        application.setCreditScore(request.getCreditScore());
        application.setMonthlyDebtPayments(request.getMonthlyDebtPayments());
        application.setRequestedAmount(request.getRequestedAmount());
        application.setLoanTenure(request.getLoanTenure());
        application.setEmploymentType(request.getEmploymentType());
        application.setLoanPurpose(request.getLoanPurpose());
        
        // Set eligibility results
        application.setEligible(request.isEligible());
        application.setEligibilityReason(request.getEligibilityReason());
        application.setApprovedAmount(request.getApprovedAmount());
        application.setInterestRate(request.getInterestRate());
        application.setMonthlyEmi(request.getMonthlyEmi());
        
        // Set application status and timestamps
        application.setStatus("PENDING"); // Default status
        application.setCreatedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());
        
        return loanApplicationRepository.save(application);
    }
    
    public List<LoanApplication> getApplicationsByEmail(String email) {
        return loanApplicationRepository.findByEmailOrderByCreatedAtDesc(email);
    }
    
    public List<LoanApplication> getApplicationsByUserId(String userId) {
        return loanApplicationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public Optional<LoanApplication> getApplicationById(String applicationId) {
        return loanApplicationRepository.findById(applicationId);
    }
    
    public List<LoanApplication> getAllApplications() {
        return loanApplicationRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public LoanApplication updateApplicationStatus(String applicationId, String status) {
        Optional<LoanApplication> optionalApplication = loanApplicationRepository.findById(applicationId);
        
        if (optionalApplication.isPresent()) {
            LoanApplication application = optionalApplication.get();
            application.setStatus(status);
            application.setUpdatedAt(LocalDateTime.now());
            return loanApplicationRepository.save(application);
        }
        
        throw new RuntimeException("Application not found with ID: " + applicationId);
    }
    
    public void deleteApplication(String applicationId) {
        if (loanApplicationRepository.existsById(applicationId)) {
            loanApplicationRepository.deleteById(applicationId);
        } else {
            throw new RuntimeException("Application not found with ID: " + applicationId);
        }
    }
    
    private User findOrCreateUser(String email, String name, String phone) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            // Update user info if needed
            User user = existingUser.get();
            user.setName(name);
            user.setPhone(phone);
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        } else {
            // Create new user
            User newUser = new User();
            newUser.setName(name);
            newUser.setEmail(email);
            newUser.setPhone(phone);
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(newUser);
        }
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Helper method to get application statistics
    public ApplicationStats getApplicationStats() {
        List<LoanApplication> allApplications = loanApplicationRepository.findAll();
        
        long totalApplications = allApplications.size();
        long approvedApplications = allApplications.stream()
                .filter(app -> "APPROVED".equals(app.getStatus()))
                .count();
        long pendingApplications = allApplications.stream()
                .filter(app -> "PENDING".equals(app.getStatus()))
                .count();
        long rejectedApplications = allApplications.stream()
                .filter(app -> "REJECTED".equals(app.getStatus()))
                .count();
        
        double totalRequestedAmount = allApplications.stream()
                .mapToDouble(LoanApplication::getRequestedAmount)
                .sum();
        
        double totalApprovedAmount = allApplications.stream()
                .filter(app -> app.getApprovedAmount() > 0)
                .mapToDouble(LoanApplication::getApprovedAmount)
                .sum();
        
        return new ApplicationStats(totalApplications, approvedApplications, 
                                  pendingApplications, rejectedApplications,
                                  totalRequestedAmount, totalApprovedAmount);
    }
    
    // Inner classes for DTOs
    public static class LoanApplicationRequest {
        private String name;
        private String email;
        private String phone;
        private int age;
        private double annualIncome;
        private int creditScore;
        private double monthlyDebtPayments;
        private double requestedAmount;
        private int loanTenure;
        private String employmentType;
        private String loanPurpose;
        
        // Eligibility results
        private boolean eligible;
        private String eligibilityReason;
        private double approvedAmount;
        private double interestRate;
        private double monthlyEmi;
        
        // Constructors
        public LoanApplicationRequest() {}
        
        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        
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
    
    public static class ApplicationStats {
        private long totalApplications;
        private long approvedApplications;
        private long pendingApplications;
        private long rejectedApplications;
        private double totalRequestedAmount;
        private double totalApprovedAmount;
        
        public ApplicationStats(long totalApplications, long approvedApplications, 
                              long pendingApplications, long rejectedApplications,
                              double totalRequestedAmount, double totalApprovedAmount) {
            this.totalApplications = totalApplications;
            this.approvedApplications = approvedApplications;
            this.pendingApplications = pendingApplications;
            this.rejectedApplications = rejectedApplications;
            this.totalRequestedAmount = totalRequestedAmount;
            this.totalApprovedAmount = totalApprovedAmount;
        }
        
        // Getters and Setters
        public long getTotalApplications() { return totalApplications; }
        public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }
        
        public long getApprovedApplications() { return approvedApplications; }
        public void setApprovedApplications(long approvedApplications) { this.approvedApplications = approvedApplications; }
        
        public long getPendingApplications() { return pendingApplications; }
        public void setPendingApplications(long pendingApplications) { this.pendingApplications = pendingApplications; }
        
        public long getRejectedApplications() { return rejectedApplications; }
        public void setRejectedApplications(long rejectedApplications) { this.rejectedApplications = rejectedApplications; }
        
        public double getTotalRequestedAmount() { return totalRequestedAmount; }
        public void setTotalRequestedAmount(double totalRequestedAmount) { this.totalRequestedAmount = totalRequestedAmount; }
        
        public double getTotalApprovedAmount() { return totalApprovedAmount; }
        public void setTotalApprovedAmount(double totalApprovedAmount) { this.totalApprovedAmount = totalApprovedAmount; }
    }
}