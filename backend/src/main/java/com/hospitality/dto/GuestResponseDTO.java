package com.hospitality.dto;

import java.time.LocalDateTime;

public class GuestResponseDTO {

    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private String city;
    private String country;
    private LocalDateTime registrationDate;
    private int totalReservations;
    private int totalStays;

    public GuestResponseDTO() {}

    public GuestResponseDTO(Long id, String fullName, String email, String phoneNumber,
                            String address, String city, String country, LocalDateTime registrationDate,
                            int totalReservations) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.city = city;
        this.country = country;
        this.registrationDate = registrationDate;
        this.totalReservations = totalReservations;
        this.totalStays = totalReservations;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public int getTotalReservations() { return totalReservations; }
    public void setTotalReservations(int totalReservations) { 
        this.totalReservations = totalReservations; 
        this.totalStays = totalReservations;
    }

    public int getTotalStays() { return totalStays; }
    public void setTotalStays(int totalStays) { 
        this.totalStays = totalStays; 
        this.totalReservations = totalStays;
    }
}
