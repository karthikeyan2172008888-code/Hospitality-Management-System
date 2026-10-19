package com.hospitality;

import com.hospitality.dto.ReservationRequestDTO;
import com.hospitality.dto.ReservationResponseDTO;
import com.hospitality.entity.*;
import com.hospitality.exception.BadRequestException;
import com.hospitality.exception.ConflictException;
import com.hospitality.repository.*;
import com.hospitality.service.ReservationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private GuestRepository guestRepository;
    @Mock
    private HotelRepository hotelRepository;
    @Mock
    private RoomRepository roomRepository;
    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private ReservationService reservationService;

    private Hotel testHotel;
    private Room testRoom;
    private Guest testGuest;

    @BeforeEach
    void setUp() {
        testHotel = new Hotel(1L, "Grand Horizon Palace", "124 Marine Drive", "Mumbai", "Maharashtra", "India",
                "+91 22 2845 9000", "stay@grandhorizon.com", "Luxury waterfront", "WiFi, Pool");

        testRoom = new Room(101L, testHotel, "101", RoomType.DELUXE, 1, 2,
                BigDecimal.valueOf(5000.00), RoomStatus.AVAILABLE, "Sea view room", "WiFi, AC");

        testGuest = new Guest(1L, "Aarav Sharma", "aarav@example.com", "+91 98201 12345",
                "42 Palm Ave", "Mumbai", "India");
    }

    @Test
    @DisplayName("Should successfully create reservation and accurately calculate total cost")
    void testCreateReservation_Success() {
        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(5); // 3 nights

        ReservationRequestDTO request = new ReservationRequestDTO();
        request.setGuestId(1L);
        request.setHotelId(1L);
        request.setRoomId(101L);
        request.setCheckInDate(checkIn);
        request.setCheckOutDate(checkOut);
        request.setNumberOfGuests(2);
        request.setSpecialRequests("Ocean facing preferred");

        when(guestRepository.findById(1L)).thenReturn(Optional.of(testGuest));
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(roomRepository.findById(101L)).thenReturn(Optional.of(testRoom));
        when(reservationRepository.findOverlappingReservations(eq(101L), eq(checkIn), eq(checkOut), isNull()))
                .thenReturn(Collections.emptyList());
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(invocation -> {
            Reservation r = invocation.getArgument(0);
            r.setId(999L);
            return r;
        });
        when(paymentRepository.sumCompletedPaymentsByReservationId(anyLong())).thenReturn(BigDecimal.ZERO);

        ReservationResponseDTO response = reservationService.createReservation(request);

        assertNotNull(response);
        assertEquals(3, response.getNumberOfNights());
        assertEquals(BigDecimal.valueOf(15000.00), response.getTotalCost()); // 3 * 5000
        assertEquals(ReservationStatus.CONFIRMED, response.getStatus());
        assertEquals("Grand Horizon Palace", response.getHotelName());
        assertEquals("101", response.getRoomNumber());
        verify(reservationRepository, times(1)).save(any(Reservation.class));
    }

    @Test
    @DisplayName("Should reject booking when dates overlap with existing active reservation")
    void testCreateReservation_DateOverlapConflict() {
        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(5);

        ReservationRequestDTO request = new ReservationRequestDTO();
        request.setGuestId(1L);
        request.setHotelId(1L);
        request.setRoomId(101L);
        request.setCheckInDate(checkIn);
        request.setCheckOutDate(checkOut);
        request.setNumberOfGuests(2);

        Reservation existingConflict = new Reservation(500L, testGuest, testHotel, testRoom, null,
                checkIn.plusDays(1), checkOut.plusDays(2), 2, 4,
                BigDecimal.valueOf(5000.00), BigDecimal.valueOf(20000.00),
                ReservationStatus.CONFIRMED, null);

        when(guestRepository.findById(1L)).thenReturn(Optional.of(testGuest));
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(roomRepository.findById(101L)).thenReturn(Optional.of(testRoom));
        when(reservationRepository.findOverlappingReservations(eq(101L), eq(checkIn), eq(checkOut), isNull()))
                .thenReturn(List.of(existingConflict));

        ConflictException ex = assertThrows(ConflictException.class, () -> reservationService.createReservation(request));
        assertTrue(ex.getMessage().contains("Conflicting booking exists"));
        verify(reservationRepository, never()).save(any(Reservation.class));
    }

    @Test
    @DisplayName("Should reject booking when number of guests exceeds room capacity")
    void testCreateReservation_CapacityExceeded() {
        LocalDate checkIn = LocalDate.now().plusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(3);

        ReservationRequestDTO request = new ReservationRequestDTO();
        request.setGuestId(1L);
        request.setHotelId(1L);
        request.setRoomId(101L);
        request.setCheckInDate(checkIn);
        request.setCheckOutDate(checkOut);
        request.setNumberOfGuests(5); // Capacity is 2

        when(guestRepository.findById(1L)).thenReturn(Optional.of(testGuest));
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(roomRepository.findById(101L)).thenReturn(Optional.of(testRoom));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> reservationService.createReservation(request));
        assertTrue(ex.getMessage().contains("exceeds room capacity"));
    }

    @Test
    @DisplayName("Should reject booking when room is under maintenance")
    void testCreateReservation_RoomInMaintenance() {
        testRoom.setStatus(RoomStatus.MAINTENANCE);
        LocalDate checkIn = LocalDate.now().plusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(3);

        ReservationRequestDTO request = new ReservationRequestDTO();
        request.setGuestId(1L);
        request.setHotelId(1L);
        request.setRoomId(101L);
        request.setCheckInDate(checkIn);
        request.setCheckOutDate(checkOut);
        request.setNumberOfGuests(2);

        when(guestRepository.findById(1L)).thenReturn(Optional.of(testGuest));
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(roomRepository.findById(101L)).thenReturn(Optional.of(testRoom));

        ConflictException ex = assertThrows(ConflictException.class, () -> reservationService.createReservation(request));
        assertTrue(ex.getMessage().contains("MAINTENANCE"));
    }
}
