package com.loan.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Document(collection = "loan_applications")
public class LoanApplication {
    
    @Id
    private String id;
    
    @NotBlank(message = "Applicant name is required")
    private String applicantName;
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Phone is required")
    private String phone;
    
    @NotNull(message = "Monthly income is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Monthly income must be greater than 0")
    private Double monthlyIncome;
    
    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "1000.0", message = "Minimum loan amount is 1000")
    @DecimalMax(value = "10000000.0", message = "Maximum loan amount is 10,000,000")
    private Double loanAmount;
    
    @NotNull(message = "Loan term is required")
    @Min(value = 1, message = "Loan term must be at least 1 month")
    @Max(value = 360, message = "Loan term cannot exceed 360 months")
    private Integer loanTerm; // in months
    
    @NotBlank(message = "Employment status is required")
    private String employmentStatus; // EMPLOYED, SELF_EMPLOYED, UNEMPLOYED
    
    @Min(value = 0, message = "Work experience cannot be negative")
    private Integer workExperience; // in years
    
    @DecimalMin(value = "0.0", message = "Existing debt cannot be negative")
    private Double existingDebt;
    
    @Min(value = 300, message = "Credit score must be at least 300")
    @Max(value = 850, message = "Credit score cannot exceed 850")
    private Integer creditScore;
    
    // Eligibility result fields
    private Boolean isEligible;
    private String eligibilityReason;
    private Double approvedAmount;
    private String riskLevel; // LOW, MEDIUM, HIGH
    private Double interestRate;
    
    // Application status
    private String status; // PENDING, APPROVED, REJECTED, UNDER_REVIEW
    
    // Timestamps
    private LocalDateTime appliedAt;
    private LocalDateTime processedAt;
    private LocalDateTime updatedAt;
    
    // Reference to user (optional)
    @DBRef
    private User user;
    
    // Constructors
    public LoanApplication() {
        this.appliedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "PENDING";
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getApplicantName() {
        return applicantName;
    }
    
    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public Double getMonthlyIncome() {
        return monthlyIncome;
    }
    
    public void setMonthlyIncome(Double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }
    
    public Double getLoanAmount() {
        return loanAmount;
    }
    
    public void setLoanAmount(Double loanAmount) {
        this.loanAmount = loanAmount;
    }
    
    public Integer getLoanTerm() {
        return loanTerm;
    }
    
    public void setLoanTerm(Integer loanTerm) {
        this.loanTerm = loanTerm;
    }
    
    public String getEmploymentStatus() {
        return employmentStatus;
    }
    
    public void setEmploymentStatus(String employmentStatus) {
        this.employmentStatus = employmentStatus;
    }
    
    public Integer getWorkExperience() {
        return workExperience;
    }
    
    public void setWorkExperience(Integer workExperience) {
        this.workExperience = workExperience;
    }
    
    public Double getExistingDebt() {
        return existingDebt;
    }
    
    public void setExistingDebt(Double existingDebt) {
        this.existingDebt = existingDebt;
    }
    
    public Integer getCreditScore() {
        return creditScore;
    }
    
    public void setCreditScore(Integer creditScore) {
        this.creditScore = creditScore;
    }
    
    public Boolean getIsEligible() {
        return isEligible;
    }
    
    public void setIsEligible(Boolean isEligible) {
        this.isEligible = isEligible;
    }
    
    public String getEligibilityReason() {
        return eligibilityReason;
    }
    
    public void setEligibilityReason(String eligibilityReason) {
        this.eligibilityReason = eligibilityReason;
    }
    
    public Double getApprovedAmount() {
        return approvedAmount;
    }
    
    public void setApprovedAmount(Double approvedAmount) {
        this.approvedAmount = approvedAmount;
    }
    
    public String getRiskLevel() {
        return riskLevel;
    }
    
    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
    
    public Double getInterestRate() {
        return interestRate;
    }
    
    public void setInterestRate(Double interestRate) {
        this.interestRate = interestRate;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }
    
    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }
    
    public LocalDateTime getProcessedAt() {
        return processedAt;
    }
    
    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    // Helper method to calculate debt-to-income ratio
    public Double getDebtToIncomeRatio() {
        if (monthlyIncome == null || monthlyIncome <= 0) {
            return null;
        }
        double monthlyDebt = (existingDebt != null ? existingDebt : 0.0);
        return (monthlyDebt / monthlyIncome) * 100;
    }
    
    @Override
    public String toString() {
        return "LoanApplication{" +
                "id='" + id + '\'' +
                ", applicantName='" + applicantName + '\'' +
                ", email='" + email + '\'' +
                ", loanAmount=" + loanAmount +
                ", monthlyIncome=" + monthlyIncome +
                ", status='" + status + '\'' +
                ", isEligible=" + isEligible +
                ", appliedAt=" + appliedAt +
                '}';
    }
}