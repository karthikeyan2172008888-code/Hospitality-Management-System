package com.hospitality.controller;

import com.hospitality.dto.ApiResponse;
import com.hospitality.dto.HotelRequestDTO;
import com.hospitality.dto.HotelResponseDTO;
import com.hospitality.service.HotelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@Tag(name = "Hotel Management", description = "Endpoints for managing hotels, branches, and amenities")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    @Operation(summary = "Get all hotels with optional name/city search")
    public ResponseEntity<ApiResponse<List<HotelResponseDTO>>> getAllHotels(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String city) {
        List<HotelResponseDTO> hotels = hotelService.getAllHotels(query, city);
        return ResponseEntity.ok(ApiResponse.success(hotels));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a hotel by its unique ID")
    public ResponseEntity<ApiResponse<HotelResponseDTO>> getHotelById(@PathVariable Long id) {
        HotelResponseDTO hotel = hotelService.getHotelById(id);
        return ResponseEntity.ok(ApiResponse.success(hotel));
    }

    @PostMapping
    @Operation(summary = "Create a new hotel property")
    public ResponseEntity<ApiResponse<HotelResponseDTO>> createHotel(@Valid @RequestBody HotelRequestDTO dto) {
        HotelResponseDTO created = hotelService.createHotel(dto);
        return new ResponseEntity<>(ApiResponse.success("Hotel created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing hotel property")
    public ResponseEntity<ApiResponse<HotelResponseDTO>> updateHotel(
            @PathVariable Long id,
            @Valid @RequestBody HotelRequestDTO dto) {
        HotelResponseDTO updated = hotelService.updateHotel(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Hotel updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a hotel (only allowed if it has no rooms or active reservations)")
    public ResponseEntity<ApiResponse<Void>> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok(ApiResponse.success("Hotel deleted successfully", null));
    }
}
