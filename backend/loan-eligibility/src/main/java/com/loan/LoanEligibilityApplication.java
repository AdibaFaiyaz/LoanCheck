package com.loan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class LoanEligibilityApplication {
    public static void main(String[] args) {
        SpringApplication.run(LoanEligibilityApplication.class, args);
    }
}