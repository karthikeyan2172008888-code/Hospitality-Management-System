package com.hospitality.repository;

import com.hospitality.entity.Reservation;
import com.hospitality.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByGuestIdOrderByCreatedAtDesc(Long guestId);

    List<Reservation> findByHotelIdOrderByCreatedAtDesc(Long hotelId);

    List<Reservation> findByRoomIdOrderByCreatedAtDesc(Long roomId);

    List<Reservation> findByStatus(ReservationStatus status);

    long countByStatus(ReservationStatus status);

    long countByCheckInDate(LocalDate date);

    long countByCheckOutDate(LocalDate date);

    List<Reservation> findTop10ByOrderByCreatedAtDesc();

    /**
     * Finds overlapping active reservations for a specific room within a date window.
     * Overlap occurs when:
     *   newCheckIn < existingCheckOut AND newCheckOut > existingCheckIn
     * Cancelled reservations are excluded.
     * Optional excludeId is used when updating an existing reservation.
     */
    @Query("SELECT r FROM Reservation r WHERE " +
           "r.room.id = :roomId AND " +
           "r.status != com.hospitality.entity.ReservationStatus.CANCELLED AND " +
           "r.checkInDate < :checkOutDate AND " +
           "r.checkOutDate > :checkInDate AND " +
           "(:excludeId IS NULL OR r.id != :excludeId)")
    List<Reservation> findOverlappingReservations(@Param("roomId") Long roomId,
                                                @Param("checkInDate") LocalDate checkInDate,
                                                @Param("checkOutDate") LocalDate checkOutDate,
                                                @Param("excludeId") Long excludeId);

    @Query("SELECT r FROM Reservation r WHERE " +
           "(:hotelId IS NULL OR r.hotel.id = :hotelId) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:guestQuery IS NULL OR LOWER(r.guest.fullName) LIKE LOWER(CONCAT('%', :guestQuery, '%')) OR LOWER(r.guest.email) LIKE LOWER(CONCAT('%', :guestQuery, '%'))) " +
           "ORDER BY r.createdAt DESC")
    List<Reservation> searchReservations(@Param("hotelId") Long hotelId,
                                        @Param("status") ReservationStatus status,
                                        @Param("guestQuery") String guestQuery);
}
