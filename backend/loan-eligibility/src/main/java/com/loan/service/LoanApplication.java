package com.loan.service;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDateTime;

@Document(collection = "loan_applications")
public class LoanApplication {
    
    @Id
    private String id;
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
    private String phoneNumber;
    
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age cannot exceed 100")
    private Integer age;
    
    @NotNull(message = "Monthly income is required")
    @Min(value = 0, message = "Monthly income cannot be negative")
    private Double monthlyIncome;
    
    @NotNull(message = "Loan amount is required")
    @Min(value = 1000, message = "Loan amount must be at least 1000")
    private Double loanAmount;
    
    @NotBlank(message = "Loan purpose is required")
    private String loanPurpose;
    
    @NotNull(message = "Employment years is required")
    @Min(value = 0, message = "Employment years cannot be negative")
    private Integer employmentYears;
    
    private String status; // PENDING, APPROVED, REJECTED
    private String eligibilityReason;
    private LocalDateTime applicationDate;
    private LocalDateTime lastUpdated;
    
    // Constructors
    public LoanApplication() {
        this.applicationDate = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
        this.status = "PENDING";
    }
    
    public LoanApplication(String firstName, String lastName, String email, String phoneNumber, 
                          Integer age, Double monthlyIncome, Double loanAmount, String loanPurpose,
                          Integer employmentYears) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.age = age;
        this.monthlyIncome = monthlyIncome;
        this.loanAmount = loanAmount;
        this.loanPurpose = loanPurpose;
        this.employmentYears = employmentYears;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public Integer getAge() {
        return age;
    }
    
    public void setAge(Integer age) {
        this.age = age;
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
    
    public String getLoanPurpose() {
        return loanPurpose;
    }
    
    public void setLoanPurpose(String loanPurpose) {
        this.loanPurpose = loanPurpose;
    }
    
    public Integer getEmploymentYears() {
        return employmentYears;
    }
    
    public void setEmploymentYears(Integer employmentYears) {
        this.employmentYears = employmentYears;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
        this.lastUpdated = LocalDateTime.now();
    }
    
    public String getEligibilityReason() {
        return eligibilityReason;
    }
    
    public void setEligibilityReason(String eligibilityReason) {
        this.eligibilityReason = eligibilityReason;
    }
    
    public LocalDateTime getApplicationDate() {
        return applicationDate;
    }
    
    public void setApplicationDate(LocalDateTime applicationDate) {
        this.applicationDate = applicationDate;
    }
    
    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
    
    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    
    @Override
    public String toString() {
        return "LoanApplication{" +
                "id='" + id + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", age=" + age +
                ", monthlyIncome=" + monthlyIncome +
                ", loanAmount=" + loanAmount +
                ", loanPurpose='" + loanPurpose + '\'' +
                ", employmentYears=" + employmentYears +
                ", status='" + status + '\'' +
                ", applicationDate=" + applicationDate +
                '}';
    }
}