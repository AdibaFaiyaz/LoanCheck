package com.loan.repository;

import com.loan.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    // Find user by email (unique)
    Optional<User> findByEmail(String email);
    
    // Find user by phone
    Optional<User> findByPhone(String phone);
    
    // Find users by name (case-insensitive)
    List<User> findByNameContainingIgnoreCase(String name);
    
    // Check if user exists by email
    boolean existsByEmail(String email);
    
    // Check if user exists by phone
    boolean existsByPhone(String phone);
    
    // Find users created after a certain date
    List<User> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime date);
    
    // Find users by city
    List<User> findByCityOrderByNameAsc(String city);
    
    // Find users by state
    List<User> findByStateOrderByNameAsc(String state);
}