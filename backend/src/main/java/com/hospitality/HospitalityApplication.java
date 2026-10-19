package com.hospitality;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for Hospitality Management System.
 * Connects frontend, REST APIs, and database layer.
 */
@SpringBootApplication
public class HospitalityApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalityApplication.class, args);
    }
}
