package com.hospitality.service;

import com.hospitality.dto.ReservationRequestDTO;
import com.hospitality.dto.ReservationResponseDTO;
import com.hospitality.entity.*;
import com.hospitality.exception.BadRequestException;
import com.hospitality.exception.ConflictException;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final GuestRepository guestRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final PaymentRepository paymentRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              GuestRepository guestRepository,
                              HotelRepository hotelRepository,
                              RoomRepository roomRepository,
                              PaymentRepository paymentRepository) {
        this.reservationRepository = reservationRepository;
        this.guestRepository = guestRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> getAllReservations(Long hotelId, ReservationStatus status, String guestQuery) {
        List<Reservation> reservations = reservationRepository.searchReservations(hotelId, status, guestQuery);
        return reservations.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationResponseDTO getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        return mapToResponse(reservation);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> getReservationsByGuestId(Long guestId) {
        return reservationRepository.findByGuestIdOrderByCreatedAtDesc(guestId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> getRecentReservations() {
        return reservationRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new reservation with strict validation and concurrency-safe overlap prevention.
     */
    public ReservationResponseDTO createReservation(ReservationRequestDTO dto) {
        Guest guest = guestRepository.findById(dto.getGuestId())
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found with id: " + dto.getGuestId()));

        Hotel hotel = hotelRepository.findById(dto.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + dto.getHotelId()));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + dto.getRoomId()));

        validateReservationRules(room, hotel, dto.getCheckInDate(), dto.getCheckOutDate(), dto.getNumberOfGuests(), null);

        long nights = ChronoUnit.DAYS.between(dto.getCheckInDate(), dto.getCheckOutDate());
        BigDecimal totalCost = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        Reservation reservation = new Reservation();
        reservation.setGuest(guest);
        reservation.setHotel(hotel);
        reservation.setRoom(room);
        reservation.setCheckInDate(dto.getCheckInDate());
        reservation.setCheckOutDate(dto.getCheckOutDate());
        reservation.setNumberOfGuests(dto.getNumberOfGuests());
        reservation.setNumberOfNights((int) nights);
        reservation.setPricePerNight(room.getPricePerNight());
        reservation.setTotalCost(totalCost);
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setSpecialRequests(dto.getSpecialRequests());

        Reservation saved = reservationRepository.save(reservation);
        return mapToResponse(saved);
    }

    public ReservationResponseDTO updateReservation(Long id, ReservationRequestDTO dto) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        if (reservation.getStatus() == ReservationStatus.CANCELLED || reservation.getStatus() == ReservationStatus.CHECKED_OUT) {
            throw new BadRequestException("Cannot edit reservation in '" + reservation.getStatus() + "' status");
        }

        Guest guest = guestRepository.findById(dto.getGuestId())
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found with id: " + dto.getGuestId()));

        Hotel hotel = hotelRepository.findById(dto.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + dto.getHotelId()));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + dto.getRoomId()));

        validateReservationRules(room, hotel, dto.getCheckInDate(), dto.getCheckOutDate(), dto.getNumberOfGuests(), id);

        long nights = ChronoUnit.DAYS.between(dto.getCheckInDate(), dto.getCheckOutDate());
        BigDecimal totalCost = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        reservation.setGuest(guest);
        reservation.setHotel(hotel);
        reservation.setRoom(room);
        reservation.setCheckInDate(dto.getCheckInDate());
        reservation.setCheckOutDate(dto.getCheckOutDate());
        reservation.setNumberOfGuests(dto.getNumberOfGuests());
        reservation.setNumberOfNights((int) nights);
        reservation.setPricePerNight(room.getPricePerNight());
        reservation.setTotalCost(totalCost);
        reservation.setSpecialRequests(dto.getSpecialRequests());

        Reservation updated = reservationRepository.save(reservation);
        return mapToResponse(updated);
    }

    public ReservationResponseDTO updateStatus(Long id, ReservationStatus newStatus) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        if (reservation.getStatus() == ReservationStatus.CANCELLED && newStatus != ReservationStatus.CANCELLED) {
            // If reactivating a cancelled reservation, verify date overlap again
            validateOverlap(reservation.getRoom().getId(), reservation.getCheckInDate(), reservation.getCheckOutDate(), reservation.getId());
        }

        reservation.setStatus(newStatus);
        Reservation updated = reservationRepository.save(reservation);
        return mapToResponse(updated);
    }

    public ReservationResponseDTO cancelReservation(Long id) {
        return updateStatus(id, ReservationStatus.CANCELLED);
    }

    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        reservationRepository.delete(reservation);
    }

    /**
     * Validates business constraints:
     * 1. Check-out must be after check-in.
     * 2. Room must belong to hotel.
     * 3. Guest count must not exceed room capacity.
     * 4. Room must not be in maintenance or out of service.
     * 5. Date overlap check (exclusive check-out date).
     */
    private void validateReservationRules(Room room, Hotel hotel, LocalDate checkIn, LocalDate checkOut,
                                          int guests, Long excludeReservationId) {
        if (checkIn == null || checkOut == null) {
            throw new BadRequestException("Check-in and check-out dates are required");
        }

        if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
            throw new BadRequestException("Check-out date (" + checkOut + ") must be later than check-in date (" + checkIn + ")");
        }

        if (!room.getHotel().getId().equals(hotel.getId())) {
            throw new BadRequestException("Room " + room.getRoomNumber() + " does not belong to hotel '" + hotel.getName() + "'");
        }

        if (guests > room.getMaxCapacity()) {
            throw new BadRequestException("Number of guests (" + guests + ") exceeds room capacity (" + room.getMaxCapacity() + ")");
        }

        if (room.getStatus() == RoomStatus.MAINTENANCE) {
            throw new ConflictException("Room " + room.getRoomNumber() + " is currently under MAINTENANCE and cannot be booked.");
        }

        if (room.getStatus() == RoomStatus.OUT_OF_SERVICE) {
            throw new ConflictException("Room " + room.getRoomNumber() + " is OUT OF SERVICE and cannot be booked.");
        }

        validateOverlap(room.getId(), checkIn, checkOut, excludeReservationId);
    }

    private void validateOverlap(Long roomId, LocalDate checkIn, LocalDate checkOut, Long excludeId) {
        List<Reservation> conflicts = reservationRepository.findOverlappingReservations(roomId, checkIn, checkOut, excludeId);
        if (!conflicts.isEmpty()) {
            Reservation conflict = conflicts.get(0);
            throw new ConflictException("Room is unavailable for requested dates. Conflicting booking exists from "
                    + conflict.getCheckInDate() + " to " + conflict.getCheckOutDate()
                    + " (Reservation #" + conflict.getId() + ")");
        }
    }

    public ReservationResponseDTO mapToResponse(Reservation r) {
        BigDecimal totalPaid = paymentRepository.sumCompletedPaymentsByReservationId(r.getId());
        if (totalPaid == null) {
            totalPaid = BigDecimal.ZERO;
        }
        BigDecimal balance = r.getTotalCost().subtract(totalPaid);
        if (balance.compareTo(BigDecimal.ZERO) < 0) {
            balance = BigDecimal.ZERO;
        }

        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.setId(r.getId());
        dto.setGuestId(r.getGuest().getId());
        dto.setGuestName(r.getGuest().getFullName());
        dto.setGuestEmail(r.getGuest().getEmail());
        dto.setGuestPhone(r.getGuest().getPhoneNumber());

        dto.setHotelId(r.getHotel().getId());
        dto.setHotelName(r.getHotel().getName());

        dto.setRoomId(r.getRoom().getId());
        dto.setRoomNumber(r.getRoom().getRoomNumber());
        dto.setRoomType(r.getRoom().getRoomType());

        dto.setBookingDate(r.getBookingDate());
        dto.setCheckInDate(r.getCheckInDate());
        dto.setCheckOutDate(r.getCheckOutDate());
        dto.setNumberOfGuests(r.getNumberOfGuests());
        dto.setNumberOfNights(r.getNumberOfNights());
        dto.setPricePerNight(r.getPricePerNight());
        dto.setTotalCost(r.getTotalCost());
        dto.setTotalPaid(totalPaid);
        dto.setRemainingBalance(balance);
        dto.setStatus(r.getStatus());
        dto.setSpecialRequests(r.getSpecialRequests());
        dto.setCreatedAt(r.getCreatedAt());

        return dto;
    }
}
