package com.loan.repository;

import com.loan.entity.LoanApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoanApplicationRepository extends MongoRepository<LoanApplication, String> {
    
    // Find applications by email
    List<LoanApplication> findByEmailOrderByCreatedAtDesc(String email);
    
    // Find applications by user ID
    List<LoanApplication> findByUserIdOrderByCreatedAtDesc(String userId);
    
    // Find applications by status
    List<LoanApplication> findByStatusOrderByCreatedAtDesc(String status);
    
    // Find all applications ordered by creation date (newest first)
    List<LoanApplication> findAllByOrderByCreatedAtDesc();
    
    // Find applications by eligibility status
    List<LoanApplication> findByEligibleOrderByCreatedAtDesc(boolean eligible);
    
    // Find applications by date range
    List<LoanApplication> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find applications with requested amount greater than specified value
    List<LoanApplication> findByRequestedAmountGreaterThanOrderByCreatedAtDesc(double amount);
    
    // Find applications with approved amount greater than specified value
    List<LoanApplication> findByApprovedAmountGreaterThanOrderByCreatedAtDesc(double amount);
    
    // Find applications by employment type
    List<LoanApplication> findByEmploymentTypeOrderByCreatedAtDesc(String employmentType);
    
    // Custom query to find applications by credit score range
    @Query("{'creditScore': {$gte: ?0, $lte: ?1}}")
    List<LoanApplication> findByCreditScoreRange(int minScore, int maxScore);
    
    // Custom query to find high-value applications
    @Query("{'requestedAmount': {$gte: ?0}, 'eligible': true}")
    List<LoanApplication> findHighValueEligibleApplications(double minAmount);
    
    // Count applications by status
    long countByStatus(String status);
    
    // Count eligible applications
    long countByEligible(boolean eligible);
    
    // Find recent applications (last N days)
    @Query("{'createdAt': {$gte: ?0}}")
    List<LoanApplication> findRecentApplications(LocalDateTime fromDate);
}