package com.hospitality.dto;

import com.hospitality.entity.RoomStatus;
import com.hospitality.entity.RoomType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class RoomRequestDTO {

    @NotNull(message = "Hotel ID is required")
    private Long hotelId;

    @NotBlank(message = "Room number is required")
    @Size(max = 20, message = "Room number must be at most 20 characters")
    private String roomNumber;

    @NotNull(message = "Room type is required")
    private RoomType roomType;

    @NotNull(message = "Floor number is required")
    @Min(value = 0, message = "Floor number must be 0 or higher")
    private Integer floorNumber;

    @NotNull(message = "Maximum capacity is required")
    @Min(value = 1, message = "Maximum capacity must be at least 1 guest")
    private Integer maxCapacity;

    @NotNull(message = "Price per night is required")
    @DecimalMin(value = "0.01", message = "Price per night must be greater than zero")
    private BigDecimal pricePerNight;

    private RoomStatus status = RoomStatus.AVAILABLE;

    private String description;
    private String amenities;

    public RoomRequestDTO() {}

    // Getters and Setters
    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

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
}
