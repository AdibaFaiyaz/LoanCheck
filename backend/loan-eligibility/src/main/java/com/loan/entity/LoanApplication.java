package com.loan.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "loan_applications")
public class LoanApplication {
    
    @Id
    private String id;
    
    @Field("user_id")
    private String userId;
    
    private String name;
    private String email;
    private String phone;
    private int age;
    
    @Field("annual_income")
    private double annualIncome;
    
    @Field("credit_score")
    private int creditScore;
    
    @Field("monthly_debt_payments")
    private double monthlyDebtPayments;
    
    @Field("requested_amount")
    private double requestedAmount;
    
    @Field("loan_tenure")
    private int loanTenure; // in months
    
    @Field("employment_type")
    private String employmentType;
    
    @Field("loan_purpose")
    private String loanPurpose;
    
    // Eligibility results
    private boolean eligible;
    
    @Field("eligibility_reason")
    private String eligibilityReason;
    
    @Field("approved_amount")
    private double approvedAmount;
    
    @Field("interest_rate")
    private double interestRate;
    
    @Field("monthly_emi")
    private double monthlyEmi;
    
    // Application status
    private String status; // PENDING, APPROVED, REJECTED, PROCESSING
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public LoanApplication() {}
    
    public LoanApplication(String name, String email, String phone, int age, 
                          double annualIncome, int creditScore, double monthlyDebtPayments,
                          double requestedAmount, int loanTenure, String employmentType,
                          String loanPurpose) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.age = age;
        this.annualIncome = annualIncome;
        this.creditScore = creditScore;
        this.monthlyDebtPayments = monthlyDebtPayments;
        this.requestedAmount = requestedAmount;
        this.loanTenure = loanTenure;
        this.employmentType = employmentType;
        this.loanPurpose = loanPurpose;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "PENDING";
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
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
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @Override
    public String toString() {
        return "LoanApplication{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", requestedAmount=" + requestedAmount +
                ", status='" + status + '\'' +
                ", eligible=" + eligible +
                ", createdAt=" + createdAt +
                '}';
    }
}