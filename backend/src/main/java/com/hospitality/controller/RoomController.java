package com.hospitality.controller;

import com.hospitality.dto.ApiResponse;
import com.hospitality.dto.RoomRequestDTO;
import com.hospitality.dto.RoomResponseDTO;
import com.hospitality.entity.RoomStatus;
import com.hospitality.entity.RoomType;
import com.hospitality.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@Tag(name = "Room Management", description = "Endpoints for managing rooms, pricing, and availability searches")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    @Operation(summary = "Get rooms with optional filters by hotel, type, status, or room number")
    public ResponseEntity<ApiResponse<List<RoomResponseDTO>>> getAllRooms(
            @RequestParam(required = false) Long hotelId,
            @RequestParam(required = false) RoomType roomType,
            @RequestParam(required = false) RoomStatus status,
            @RequestParam(required = false) String roomNumber) {
        List<RoomResponseDTO> rooms = roomService.getAllRooms(hotelId, roomType, status, roomNumber);
        return ResponseEntity.ok(ApiResponse.success(rooms));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a room by its unique ID")
    public ResponseEntity<ApiResponse<RoomResponseDTO>> getRoomById(@PathVariable Long id) {
        RoomResponseDTO room = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.success(room));
    }

    @GetMapping("/hotel/{hotelId}")
    @Operation(summary = "Get all rooms belonging to a specific hotel")
    public ResponseEntity<ApiResponse<List<RoomResponseDTO>>> getRoomsByHotelId(@PathVariable Long hotelId) {
        List<RoomResponseDTO> rooms = roomService.getRoomsByHotelId(hotelId);
        return ResponseEntity.ok(ApiResponse.success(rooms));
    }

    @GetMapping("/available")
    @Operation(summary = "Search available rooms based on check-in, check-out dates, hotel, and guest count")
    public ResponseEntity<ApiResponse<List<RoomResponseDTO>>> findAvailableRooms(
            @RequestParam(required = false) Long hotelId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam(required = false) Integer guestCount,
            @RequestParam(required = false) RoomType roomType) {
        List<RoomResponseDTO> available = roomService.findAvailableRooms(hotelId, checkInDate, checkOutDate, guestCount, roomType);
        return ResponseEntity.ok(ApiResponse.success(available));
    }

    @PostMapping
    @Operation(summary = "Add a new room to a hotel")
    public ResponseEntity<ApiResponse<RoomResponseDTO>> createRoom(@Valid @RequestBody RoomRequestDTO dto) {
        RoomResponseDTO created = roomService.createRoom(dto);
        return new ResponseEntity<>(ApiResponse.success("Room created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing room")
    public ResponseEntity<ApiResponse<RoomResponseDTO>> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequestDTO dto) {
        RoomResponseDTO updated = roomService.updateRoom(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Room updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a room (only if it has no active reservations)")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok(ApiResponse.success("Room deleted successfully", null));
    }
}
