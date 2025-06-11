package com.loan.repository;



import com.loan.entity.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanApplicationRepository extends MongoRepository<LoanApplication, String> {
    List<LoanApplication> findByUserId(String userId);
    List<LoanApplication> findByStatus(String status);
    Optional<LoanApplication> findByIdAndUserId(String id, String userId);
}