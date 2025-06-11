package com.loan.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class LoanEligibilityService {
    
    // Constants for eligibility criteria
    private static final int MIN_AGE = 18;
    private static final int MAX_AGE = 65;
    private static final double MIN_INCOME = 25000.0;
    private static final int MIN_CREDIT_SCORE = 650;
    private static final double MAX_DTI_RATIO = 0.40; // 40%
    private static final double BASE_INTEREST_RATE = 8.5;
    
    public EligibilityResult checkEligibility(EligibilityRequest request) {
        EligibilityResult result = new EligibilityResult();
        
        // Validate input
        if (request == null) {
            result.setEligible(false);
            result.setReason("Invalid request data");
            return result;
        }
        
        // Check age eligibility
        if (request.getAge() < MIN_AGE || request.getAge() > MAX_AGE) {
            result.setEligible(false);
            result.setReason("Age must be between " + MIN_AGE + " and " + MAX_AGE + " years");
            return result;
        }
        
        // Check minimum income
        if (request.getAnnualIncome() < MIN_INCOME) {
            result.setEligible(false);
            result.setReason("Annual income must be at least ₹" + MIN_INCOME);
            return result;
        }
        
        // Check credit score
        if (request.getCreditScore() < MIN_CREDIT_SCORE) {
            result.setEligible(false);
            result.setReason("Credit score must be at least " + MIN_CREDIT_SCORE);
            return result;
        }
        
        // Calculate debt-to-income ratio
        double dtiRatio = request.getMonthlyDebtPayments() / (request.getAnnualIncome() / 12);
        if (dtiRatio > MAX_DTI_RATIO) {
            result.setEligible(false);
            result.setReason("Debt-to-income ratio too high. Maximum allowed: " + (MAX_DTI_RATIO * 100) + "%");
            return result;
        }
        
        // If all checks pass, calculate loan terms
        result.setEligible(true);
        result.setReason("Congratulations! You are eligible for a loan");
        
        // Calculate maximum loan amount (typically 5-6 times annual income)
        double maxLoanAmount = calculateMaxLoanAmount(request);
        result.setMaxLoanAmount(maxLoanAmount);
        
        // Calculate interest rate based on credit score
        double interestRate = calculateInterestRate(request.getCreditScore());
        result.setInterestRate(interestRate);
        
        // Calculate monthly EMI for requested amount
        if (request.getRequestedAmount() > 0 && request.getLoanTenure() > 0) {
            if (request.getRequestedAmount() <= maxLoanAmount) {
                double monthlyEmi = calculateEMI(request.getRequestedAmount(), interestRate, request.getLoanTenure());
                result.setMonthlyEmi(monthlyEmi);
                result.setApprovedAmount(request.getRequestedAmount());
            } else {
                // Approve maximum possible amount
                double monthlyEmi = calculateEMI(maxLoanAmount, interestRate, request.getLoanTenure());
                result.setMonthlyEmi(monthlyEmi);
                result.setApprovedAmount(maxLoanAmount);
                result.setReason("Approved for maximum eligible amount of ₹" + String.format("%.2f", maxLoanAmount));
            }
        }
        
        return result;
    }
    
    private double calculateMaxLoanAmount(EligibilityRequest request) {
        double baseMultiplier = 5.0; // Base multiplier for annual income
        
        // Adjust based on credit score
        if (request.getCreditScore() >= 750) {
            baseMultiplier = 6.0;
        } else if (request.getCreditScore() >= 700) {
            baseMultiplier = 5.5;
        }
        
        // Consider existing debt obligations
        double availableIncome = request.getAnnualIncome() - (request.getMonthlyDebtPayments() * 12);
        
        return Math.min(request.getAnnualIncome() * baseMultiplier, availableIncome * 4);
    }
    
    private double calculateInterestRate(int creditScore) {
        if (creditScore >= 800) {
            return BASE_INTEREST_RATE - 1.5; // Excellent credit
        } else if (creditScore >= 750) {
            return BASE_INTEREST_RATE - 1.0; // Very good credit
        } else if (creditScore >= 700) {
            return BASE_INTEREST_RATE - 0.5; // Good credit
        } else {
            return BASE_INTEREST_RATE; // Fair credit
        }
    }
    
    private double calculateEMI(double principal, double annualRate, int tenureMonths) {
        double monthlyRate = annualRate / (12 * 100);
        
        if (monthlyRate == 0) {
            return principal / tenureMonths;
        }
        
        double emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                     (Math.pow(1 + monthlyRate, tenureMonths) - 1);
        
        return BigDecimal.valueOf(emi).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
    
    // Inner classes for request and response
    public static class EligibilityRequest {
        private String name;
        private int age;
        private double annualIncome;
        private int creditScore;
        private double monthlyDebtPayments;
        private double requestedAmount;
        private int loanTenure; // in months
        private String employmentType;
        
        // Constructors
        public EligibilityRequest() {}
        
        public EligibilityRequest(String name, int age, double annualIncome, int creditScore, 
                                double monthlyDebtPayments, double requestedAmount, int loanTenure, String employmentType) {
            this.name = name;
            this.age = age;
            this.annualIncome = annualIncome;
            this.creditScore = creditScore;
            this.monthlyDebtPayments = monthlyDebtPayments;
            this.requestedAmount = requestedAmount;
            this.loanTenure = loanTenure;
            this.employmentType = employmentType;
        }
        
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
    
    public static class EligibilityResult {
        private boolean eligible;
        private String reason;
        private double maxLoanAmount;
        private double approvedAmount;
        private double interestRate;
        private double monthlyEmi;
        
        // Constructors
        public EligibilityResult() {}
        
        // Getters and Setters
        public boolean isEligible() { return eligible; }
        public void setEligible(boolean eligible) { this.eligible = eligible; }
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        
        public double getMaxLoanAmount() { return maxLoanAmount; }
        public void setMaxLoanAmount(double maxLoanAmount) { this.maxLoanAmount = maxLoanAmount; }
        
        public double getApprovedAmount() { return approvedAmount; }
        public void setApprovedAmount(double approvedAmount) { this.approvedAmount = approvedAmount; }
        
        public double getInterestRate() { return interestRate; }
        public void setInterestRate(double interestRate) { this.interestRate = interestRate; }
        
        public double getMonthlyEmi() { return monthlyEmi; }
        public void setMonthlyEmi(double monthlyEmi) { this.monthlyEmi = monthlyEmi; }
    }
}