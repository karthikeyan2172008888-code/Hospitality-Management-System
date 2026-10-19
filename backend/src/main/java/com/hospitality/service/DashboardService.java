package com.hospitality.service;

import com.hospitality.dto.DashboardSummaryDTO;
import com.hospitality.dto.OccupancyStatsDTO;
import com.hospitality.dto.ReservationTrendDTO;
import com.hospitality.entity.Reservation;
import com.hospitality.entity.ReservationStatus;
import com.hospitality.entity.Room;
import com.hospitality.entity.RoomStatus;
import com.hospitality.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final GuestRepository guestRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;

    public DashboardService(HotelRepository hotelRepository,
                            RoomRepository roomRepository,
                            GuestRepository guestRepository,
                            ReservationRepository reservationRepository,
                            PaymentRepository paymentRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.guestRepository = guestRepository;
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
    }

    public DashboardSummaryDTO getSummary() {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        LocalDate today = LocalDate.now();

        summary.setTotalHotels(hotelRepository.count());
        long totalRooms = roomRepository.count();
        summary.setTotalRooms(totalRooms);

        long available = roomRepository.countByStatus(RoomStatus.AVAILABLE);
        long occupied = roomRepository.countByStatus(RoomStatus.OCCUPIED);
        long maintenance = roomRepository.countByStatus(RoomStatus.MAINTENANCE);
        long outOfService = roomRepository.countByStatus(RoomStatus.OUT_OF_SERVICE);

        summary.setAvailableRooms(available);
        summary.setOccupiedRooms(occupied);
        summary.setMaintenanceRooms(maintenance);
        summary.setOutOfServiceRooms(outOfService);

        summary.setTotalGuests(guestRepository.count());
        summary.setTotalReservations(reservationRepository.count());

        summary.setActiveCheckIns(reservationRepository.countByStatus(ReservationStatus.CHECKED_IN));
        summary.setUpcomingCheckIns(reservationRepository.countByCheckInDate(today));
        summary.setUpcomingCheckOuts(reservationRepository.countByCheckOutDate(today));

        BigDecimal revenue = paymentRepository.sumTotalRevenue();
        summary.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        return summary;
    }

    public List<ReservationTrendDTO> getReservationTrends() {
        List<Reservation> allReservations = reservationRepository.findAll();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");

        Map<String, List<Reservation>> groupedByMonth = allReservations.stream()
                .filter(r -> r.getCheckInDate() != null)
                .collect(Collectors.groupingBy(r -> r.getCheckInDate().format(monthFormatter), LinkedHashMap::new, Collectors.toList()));

        List<ReservationTrendDTO> trends = new ArrayList<>();
        groupedByMonth.forEach((month, list) -> {
            BigDecimal sumRevenue = list.stream()
                    .map(Reservation::getTotalCost)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            trends.add(new ReservationTrendDTO(month, list.size(), sumRevenue));
        });

        if (trends.isEmpty()) {
            trends.add(new ReservationTrendDTO("Current Month", 0, BigDecimal.ZERO));
        }

        return trends;
    }

    public List<OccupancyStatsDTO> getOccupancyStats() {
        long totalRooms = roomRepository.count();
        if (totalRooms == 0) {
            return Collections.emptyList();
        }

        List<Room> rooms = roomRepository.findAll();
        Map<RoomStatus, Long> countsByStatus = rooms.stream()
                .collect(Collectors.groupingBy(Room::getStatus, Collectors.counting()));

        List<OccupancyStatsDTO> stats = new ArrayList<>();
        for (RoomStatus status : RoomStatus.values()) {
            long count = countsByStatus.getOrDefault(status, 0L);
            double percentage = Math.round((count * 100.0 / totalRooms) * 10.0) / 10.0;
            stats.add(new OccupancyStatsDTO(status.name(), count, percentage));
        }

        return stats;
    }
}
