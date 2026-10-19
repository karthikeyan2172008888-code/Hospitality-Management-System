package com.hospitality.dto;

import com.hospitality.entity.RoomStatus;
import com.hospitality.entity.RoomType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RoomResponseDTO {

    private Long id;
    private Long hotelId;
    private String hotelName;
    private String roomNumber;
    private RoomType roomType;
    private Integer floorNumber;
    private Integer maxCapacity;
    private BigDecimal pricePerNight;
    private RoomStatus status;
    private String description;
    private String amenities;
    private LocalDateTime createdAt;

    public RoomResponseDTO() {}

    public RoomResponseDTO(Long id, Long hotelId, String hotelName, String roomNumber, RoomType roomType,
                           Integer floorNumber, Integer maxCapacity, BigDecimal pricePerNight,
                           RoomStatus status, String description, String amenities, LocalDateTime createdAt) {
        this.id = id;
        this.hotelId = hotelId;
        this.hotelName = hotelName;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.floorNumber = floorNumber;
        this.maxCapacity = maxCapacity;
        this.pricePerNight = pricePerNight;
        this.status = status;
        this.description = description;
        this.amenities = amenities;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public Integer getFloorNumber() { return floorNumber; }
    public void setFloorNumber(Integer floorNumber) { this.floorNumber = floorNumber; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public BigDecimal getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

    public RoomStatus getStatus() { return status; }
    public void setStatus(RoomStatus status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
