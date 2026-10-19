package com.hospitality.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class GuestRequestDTO {

    @NotBlank(message = "Guest full name is required")
    @Size(max = 150, message = "Name must be at most 150 characters")
    private String fullName;

    @NotBlank(message = "Email address is required")
    @Email(message = "Please enter a valid email address")
    @Size(max = 100, message = "Email must be at most 100 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(max = 30, message = "Phone number must be at most 30 characters")
    private String phoneNumber;

    private String address;
    private String city;
    private String country;

    @Min(value = 0, message = "Total stays must be 0 or higher")
    private Integer totalStays = 0;

    public GuestRequestDTO() {}

    // Getters and Setters
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

    public Integer getTotalStays() { return totalStays != null ? totalStays : 0; }
    public void setTotalStays(Integer totalStays) { this.totalStays = totalStays != null ? totalStays : 0; }
}
