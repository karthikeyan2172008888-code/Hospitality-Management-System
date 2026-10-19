package com.hospitality.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "guests")
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Guest full name is required")
    @Size(max = 150, message = "Name must be at most 150 characters")
    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @NotBlank(message = "Email address is required")
    @Email(message = "Please provide a valid email address")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(max = 30, message = "Phone number must be at most 30 characters")
    @Column(name = "phone_number", nullable = false, length = 30)
    private String phoneNumber;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String country;

    @Column(name = "total_stays")
    private Integer totalStays = 0;

    @Column(name = "registration_date", updatable = false)
    private LocalDateTime registrationDate;

    @OneToMany(mappedBy = "guest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Reservation> reservations = new ArrayList<>();

    public Guest() {}

    public Guest(Long id, String fullName, String email, String phoneNumber, String address, String city, String country) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.city = city;
        this.country = country;
        this.totalStays = 0;
    }

    public Guest(Long id, String fullName, String email, String phoneNumber, String address, String city, String country, Integer totalStays) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.city = city;
        this.country = country;
        this.totalStays = totalStays != null ? totalStays : 0;
    }

    @PrePersist
    public void prePersist() {
        if (this.registrationDate == null) {
            this.registrationDate = LocalDateTime.now();
        }
        if (this.totalStays == null) {
            this.totalStays = 0;
        }
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

    public Integer getTotalStays() { return totalStays != null ? totalStays : 0; }
    public void setTotalStays(Integer totalStays) { this.totalStays = totalStays != null ? totalStays : 0; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public List<Reservation> getReservations() { return reservations; }
    public void setReservations(List<Reservation> reservations) { this.reservations = reservations; }
}
