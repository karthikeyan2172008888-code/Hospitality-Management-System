package com.hospitality.controller;

import com.hospitality.dto.ApiResponse;
import com.hospitality.dto.GuestRequestDTO;
import com.hospitality.dto.GuestResponseDTO;
import com.hospitality.dto.ReservationResponseDTO;
import com.hospitality.service.GuestService;
import com.hospitality.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
@Tag(name = "Guest Management", description = "Endpoints for managing hotel guests and viewing booking histories")
public class GuestController {

    private final GuestService guestService;
    private final ReservationService reservationService;

    public GuestController(GuestService guestService, ReservationService reservationService) {
        this.guestService = guestService;
        this.reservationService = reservationService;
    }

    @GetMapping
    @Operation(summary = "Get all guests with optional name, email, or phone search")
    public ResponseEntity<ApiResponse<List<GuestResponseDTO>>> getAllGuests(
            @RequestParam(required = false) String query) {
        List<GuestResponseDTO> guests = guestService.getAllGuests(query);
        return ResponseEntity.ok(ApiResponse.success(guests));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get guest profile by unique ID")
    public ResponseEntity<ApiResponse<GuestResponseDTO>> getGuestById(@PathVariable Long id) {
        GuestResponseDTO guest = guestService.getGuestById(id);
        return ResponseEntity.ok(ApiResponse.success(guest));
    }

    @GetMapping("/{id}/reservations")
    @Operation(summary = "Get all historical and active reservations for a specific guest")
    public ResponseEntity<ApiResponse<List<ReservationResponseDTO>>> getGuestReservations(@PathVariable Long id) {
        List<ReservationResponseDTO> reservations = reservationService.getReservationsByGuestId(id);
        return ResponseEntity.ok(ApiResponse.success(reservations));
    }

    @PostMapping
    @Operation(summary = "Register a new guest profile")
    public ResponseEntity<ApiResponse<GuestResponseDTO>> registerGuest(@Valid @RequestBody GuestRequestDTO dto) {
        GuestResponseDTO registered = guestService.registerGuest(dto);
        return new ResponseEntity<>(ApiResponse.success("Guest registered successfully", registered), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing guest profile")
    public ResponseEntity<ApiResponse<GuestResponseDTO>> updateGuest(
            @PathVariable Long id,
            @Valid @RequestBody GuestRequestDTO dto) {
        GuestResponseDTO updated = guestService.updateGuest(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Guest updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a guest profile (if no active reservations exist)")
    public ResponseEntity<ApiResponse<Void>> deleteGuest(@PathVariable Long id) {
        guestService.deleteGuest(id);
        return ResponseEntity.ok(ApiResponse.success("Guest deleted successfully", null));
    }
}
