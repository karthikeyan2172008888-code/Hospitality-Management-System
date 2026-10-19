package com.hospitality.dto;

import java.time.LocalDateTime;

public class HotelResponseDTO {

    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String country;
    private String contactNumber;
    private String email;
    private String description;
    private String amenities;
    private LocalDateTime createdAt;
    private int totalRooms;

    public HotelResponseDTO() {}

    public HotelResponseDTO(Long id, String name, String address, String city, String state, String country,
                            String contactNumber, String email, String description, String amenities,
                            LocalDateTime createdAt, int totalRooms) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.state = state;
        this.country = country;
        this.contactNumber = contactNumber;
        this.email = email;
        this.description = description;
        this.amenities = amenities;
        this.createdAt = createdAt;
        this.totalRooms = totalRooms;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getTotalRooms() { return totalRooms; }
    public void setTotalRooms(int totalRooms) { this.totalRooms = totalRooms; }
}
