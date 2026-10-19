package com.hospitality.dto;

import java.math.BigDecimal;

public class DashboardSummaryDTO {

    private long totalHotels;
    private long totalRooms;
    private long availableRooms;
    private long occupiedRooms;
    private long maintenanceRooms;
    private long outOfServiceRooms;
    private long totalGuests;
    private long totalReservations;
    private long activeCheckIns;
    private long upcomingCheckIns;
    private long upcomingCheckOuts;
    private BigDecimal totalRevenue;

    public DashboardSummaryDTO() {}

    // Getters and Setters
    public long getTotalHotels() { return totalHotels; }
    public void setTotalHotels(long totalHotels) { this.totalHotels = totalHotels; }

    public long getTotalRooms() { return totalRooms; }
    public void setTotalRooms(long totalRooms) { this.totalRooms = totalRooms; }

    public long getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(long availableRooms) { this.availableRooms = availableRooms; }

    public long getOccupiedRooms() { return occupiedRooms; }
    public void setOccupiedRooms(long occupiedRooms) { this.occupiedRooms = occupiedRooms; }

    public long getMaintenanceRooms() { return maintenanceRooms; }
    public void setMaintenanceRooms(long maintenanceRooms) { this.maintenanceRooms = maintenanceRooms; }

    public long getOutOfServiceRooms() { return outOfServiceRooms; }
    public void setOutOfServiceRooms(long outOfServiceRooms) { this.outOfServiceRooms = outOfServiceRooms; }

    public long getTotalGuests() { return totalGuests; }
    public void setTotalGuests(long totalGuests) { this.totalGuests = totalGuests; }

    public long getTotalReservations() { return totalReservations; }
    public void setTotalReservations(long totalReservations) { this.totalReservations = totalReservations; }

    public long getActiveCheckIns() { return activeCheckIns; }
    public void setActiveCheckIns(long activeCheckIns) { this.activeCheckIns = activeCheckIns; }

    public long getUpcomingCheckIns() { return upcomingCheckIns; }
    public void setUpcomingCheckIns(long upcomingCheckIns) { this.upcomingCheckIns = upcomingCheckIns; }

    public long getUpcomingCheckOuts() { return upcomingCheckOuts; }
    public void setUpcomingCheckOuts(long upcomingCheckOuts) { this.upcomingCheckOuts = upcomingCheckOuts; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
}
