package com.hospitality.controller;

import com.hospitality.dto.ApiResponse;
import com.hospitality.dto.ReservationRequestDTO;
import com.hospitality.dto.ReservationResponseDTO;
import com.hospitality.entity.ReservationStatus;
import com.hospitality.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@Tag(name = "Reservation Management", description = "Endpoints for booking rooms, managing check-ins/check-outs, and cancellations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    @Operation(summary = "Get reservations with optional filters by hotel, status, or guest name/email")
    public ResponseEntity<ApiResponse<List<ReservationResponseDTO>>> getAllReservations(
            @RequestParam(required = false) Long hotelId,
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) String guestQuery) {
        List<ReservationResponseDTO> reservations = reservationService.getAllReservations(hotelId, status, guestQuery);
        return ResponseEntity.ok(ApiResponse.success(reservations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reservation details by ID")
    public ResponseEntity<ApiResponse<ReservationResponseDTO>> getReservationById(@PathVariable Long id) {
        ReservationResponseDTO reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(ApiResponse.success(reservation));
    }

    @PostMapping
    @Operation(summary = "Create a new room reservation (with date-overlap protection)")
    public ResponseEntity<ApiResponse<ReservationResponseDTO>> createReservation(@Valid @RequestBody ReservationRequestDTO dto) {
        ReservationResponseDTO created = reservationService.createReservation(dto);
        return new ResponseEntity<>(ApiResponse.success("Reservation confirmed successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing reservation")
    public ResponseEntity<ApiResponse<ReservationResponseDTO>> updateReservation(
            @PathVariable Long id,
            @Valid @RequestBody ReservationRequestDTO dto) {
        ReservationResponseDTO updated = reservationService.updateReservation(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Reservation updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update reservation lifecycle status (e.g. CHECKED_IN, CHECKED_OUT)")
    public ResponseEntity<ApiResponse<ReservationResponseDTO>> updateStatus(
            @PathVariable Long id,
            @RequestParam ReservationStatus status) {
        ReservationResponseDTO updated = reservationService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Reservation status updated to " + status, updated));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a reservation and release room availability")
    public ResponseEntity<ApiResponse<ReservationResponseDTO>> cancelReservation(@PathVariable Long id) {
        ReservationResponseDTO cancelled = reservationService.cancelReservation(id);
        return ResponseEntity.ok(ApiResponse.success("Reservation cancelled successfully", cancelled));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a reservation record")
    public ResponseEntity<ApiResponse<Void>> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.ok(ApiResponse.success("Reservation record deleted successfully", null));
    }
}
