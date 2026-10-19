package com.hospitality.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "reservations",
    indexes = {
        @Index(name = "idx_reservation_dates", columnList = "room_id, check_in_date, check_out_date, status"),
        @Index(name = "idx_reservation_status", columnList = "status"),
        @Index(name = "idx_reservation_guest", columnList = "guest_id"),
        @Index(name = "idx_reservation_hotel", columnList = "hotel_id")
    }
)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "booking_date")
    private LocalDateTime bookingDate;

    @NotNull(message = "Check-in date is required")
    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "At least 1 guest required")
    @Column(name = "number_of_guests", nullable = false)
    private Integer numberOfGuests;

    @NotNull(message = "Number of nights is required")
    @Min(value = 1, message = "Minimum 1 night stay required")
    @Column(name = "number_of_nights", nullable = false)
    private Integer numberOfNights;

    @NotNull(message = "Price per night is required")
    @DecimalMin(value = "0.01", message = "Price per night must be positive")
    @Column(name = "price_per_night", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @NotNull(message = "Total cost is required")
    @DecimalMin(value = "0.01", message = "Total cost must be positive")
    @Column(name = "total_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalCost;

    @NotNull(message = "Reservation status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReservationStatus status = ReservationStatus.CONFIRMED;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Payment> payments = new ArrayList<>();

    public Reservation() {}

    public Reservation(Long id, Guest guest, Hotel hotel, Room room, LocalDateTime bookingDate,
                       LocalDate checkInDate, LocalDate checkOutDate, Integer numberOfGuests,
                       Integer numberOfNights, BigDecimal pricePerNight, BigDecimal totalCost,
                       ReservationStatus status, String specialRequests) {
        this.id = id;
        this.guest = guest;
        this.hotel = hotel;
        this.room = room;
        this.bookingDate = bookingDate != null ? bookingDate : LocalDateTime.now();
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfGuests = numberOfGuests;
        this.numberOfNights = numberOfNights;
        this.pricePerNight = pricePerNight;
        this.totalCost = totalCost;
        this.status = status != null ? status : ReservationStatus.CONFIRMED;
        this.specialRequests = specialRequests;
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.bookingDate == null) {
            this.bookingDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = ReservationStatus.CONFIRMED;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Guest getGuest() { return guest; }
    public void setGuest(Guest guest) { this.guest = guest; }

    public Hotel getHotel() { return hotel; }
    public void setHotel(Hotel hotel) { this.hotel = hotel; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }

    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }

    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

    public Integer getNumberOfGuests() { return numberOfGuests; }
    public void setNumberOfGuests(Integer numberOfGuests) { this.numberOfGuests = numberOfGuests; }

    public Integer getNumberOfNights() { return numberOfNights; }
    public void setNumberOfNights(Integer numberOfNights) { this.numberOfNights = numberOfNights; }

    public BigDecimal getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }

    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Payment> getPayments() { return payments; }
    public void setPayments(List<Payment> payments) { this.payments = payments; }
}
