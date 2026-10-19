package com.hospitality.repository;

import com.hospitality.entity.Room;
import com.hospitality.entity.RoomStatus;
import com.hospitality.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByHotelId(Long hotelId);

    Optional<Room> findByHotelIdAndRoomNumber(Long hotelId, String roomNumber);

    boolean existsByHotelIdAndRoomNumber(Long hotelId, String roomNumber);

    boolean existsByHotelIdAndRoomNumberAndIdNot(Long hotelId, String roomNumber, Long id);

    List<Room> findByStatus(RoomStatus status);

    List<Room> findByRoomType(RoomType roomType);

    long countByStatus(RoomStatus status);

    @Query("SELECT r FROM Room r WHERE " +
           "(:hotelId IS NULL OR r.hotel.id = :hotelId) AND " +
           "(:roomType IS NULL OR r.roomType = :roomType) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:roomNumber IS NULL OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :roomNumber, '%')))")
    List<Room> filterRooms(@Param("hotelId") Long hotelId,
                           @Param("roomType") RoomType roomType,
                           @Param("status") RoomStatus status,
                           @Param("roomNumber") String roomNumber);

    /**
     * Search available rooms taking into account maintenance status and date overlaps with active reservations.
     * Check-out date is treated as exclusive.
     */
    @Query("SELECT r FROM Room r WHERE " +
           "(:hotelId IS NULL OR r.hotel.id = :hotelId) AND " +
           "(:guestCount IS NULL OR r.maxCapacity >= :guestCount) AND " +
           "(:roomType IS NULL OR r.roomType = :roomType) AND " +
           "r.status NOT IN (com.hospitality.entity.RoomStatus.MAINTENANCE, com.hospitality.entity.RoomStatus.OUT_OF_SERVICE) AND " +
           "r.id NOT IN (" +
           "  SELECT res.room.id FROM Reservation res " +
           "  WHERE res.status != com.hospitality.entity.ReservationStatus.CANCELLED " +
           "    AND res.checkInDate < :checkOutDate " +
           "    AND res.checkOutDate > :checkInDate" +
           ")")
    List<Room> findAvailableRooms(@Param("hotelId") Long hotelId,
                                 @Param("checkInDate") LocalDate checkInDate,
                                 @Param("checkOutDate") LocalDate checkOutDate,
                                 @Param("guestCount") Integer guestCount,
                                 @Param("roomType") RoomType roomType);
}
