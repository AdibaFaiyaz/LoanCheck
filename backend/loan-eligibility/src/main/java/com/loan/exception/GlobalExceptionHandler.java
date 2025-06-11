package com.loan.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.validation.FieldError;
import jakarta.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    // Handle validation errors for request body
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        response.put("success", false);
        response.put("error", "Validation failed");
        response.put("message", "Please check the provided data");
        response.put("validationErrors", errors);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    // Handle validation errors for request parameters
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolationException(ConstraintViolationException ex) {
        Map<String, Object> response = new HashMap<>();
        List<String> errors = new ArrayList<>();
        
        ex.getConstraintViolations().forEach(violation -> {
            errors.add(violation.getMessage());
        });
        
        response.put("success", false);
        response.put("error", "Validation failed");
        response.put("message", "Invalid request parameters");
        response.put("validationErrors", errors);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    // Handle missing request parameters
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, Object>> handleMissingParameterException(MissingServletRequestParameterException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", "Missing required parameter");
        response.put("message", "Required parameter '" + ex.getParameterName() + "' is missing");
        response.put("parameterName", ex.getParameterName());
        response.put("parameterType", ex.getParameterType());
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    // Handle IllegalArgumentException
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", "Invalid argument");
        response.put("message", ex.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    // Handle RuntimeException (including custom exceptions)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", "Runtime error");
        response.put("message", ex.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        
        // Check if it's a "not found" type error
        if (ex.getMessage().contains("not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
    
    // Handle generic exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", "Internal server error");
        response.put("message", "An unexpected error occurred");
        response.put("details", ex.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        
        // Log the exception for debugging
        ex.printStackTrace();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
    
    // Custom exception for application not found
    @ExceptionHandler(ApplicationNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleApplicationNotFoundException(ApplicationNotFoundException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", "Application not found");
        response.put("message", ex.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    // Custom exception for user not found
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFoundException(UserNotFoundException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", "User not found");
        response.put("message", ex.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    // Custom exception classes
    public static class ApplicationNotFoundException extends RuntimeException {
        public ApplicationNotFoundException(String message) {
            super(message);
        }
    }
    
    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }
}