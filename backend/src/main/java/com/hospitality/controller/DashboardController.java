package com.hospitality.controller;

import com.hospitality.dto.ApiResponse;
import com.hospitality.dto.DashboardSummaryDTO;
import com.hospitality.dto.OccupancyStatsDTO;
import com.hospitality.dto.ReservationResponseDTO;
import com.hospitality.dto.ReservationTrendDTO;
import com.hospitality.service.DashboardService;
import com.hospitality.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard & Analytics", description = "Endpoints for KPI summary metrics, recent bookings, occupancy, and trends")
public class DashboardController {

    private final DashboardService dashboardService;
    private final ReservationService reservationService;

    public DashboardController(DashboardService dashboardService, ReservationService reservationService) {
        this.dashboardService = dashboardService;
        this.reservationService = reservationService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get overall dashboard KPI statistics")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getSummary() {
        DashboardSummaryDTO summary = dashboardService.getSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/recent-reservations")
    @Operation(summary = "Get the 10 most recent reservations")
    public ResponseEntity<ApiResponse<List<ReservationResponseDTO>>> getRecentReservations() {
        List<ReservationResponseDTO> recent = reservationService.getRecentReservations();
        return ResponseEntity.ok(ApiResponse.success(recent));
    }

    @GetMapping("/reservation-trends")
    @Operation(summary = "Get monthly reservation count and revenue trends")
    public ResponseEntity<ApiResponse<List<ReservationTrendDTO>>> getReservationTrends() {
        List<ReservationTrendDTO> trends = dashboardService.getReservationTrends();
        return ResponseEntity.ok(ApiResponse.success(trends));
    }

    @GetMapping("/occupancy-stats")
    @Operation(summary = "Get room occupancy distribution across statuses")
    public ResponseEntity<ApiResponse<List<OccupancyStatsDTO>>> getOccupancyStats() {
        List<OccupancyStatsDTO> stats = dashboardService.getOccupancyStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
