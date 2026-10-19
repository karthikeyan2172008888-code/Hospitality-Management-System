package com.hospitality.service;

import com.hospitality.dto.RoomRequestDTO;
import com.hospitality.dto.RoomResponseDTO;
import com.hospitality.entity.Hotel;
import com.hospitality.entity.ReservationStatus;
import com.hospitality.entity.Room;
import com.hospitality.entity.RoomStatus;
import com.hospitality.entity.RoomType;
import com.hospitality.exception.BadRequestException;
import com.hospitality.exception.ConflictException;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.repository.HotelRepository;
import com.hospitality.repository.ReservationRepository;
import com.hospitality.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final ReservationRepository reservationRepository;

    public RoomService(RoomRepository roomRepository, HotelRepository hotelRepository,
                       ReservationRepository reservationRepository) {
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
        this.reservationRepository = reservationRepository;
    }

    @Transactional(readOnly = true)
    public List<RoomResponseDTO> getAllRooms(Long hotelId, RoomType roomType, RoomStatus status, String roomNumber) {
        List<Room> rooms = roomRepository.filterRooms(hotelId, roomType, status, roomNumber);
        return rooms.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoomResponseDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return mapToResponse(room);
    }

    @Transactional(readOnly = true)
    public List<RoomResponseDTO> getRoomsByHotelId(Long hotelId) {
        return roomRepository.findByHotelId(hotelId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public RoomResponseDTO createRoom(RoomRequestDTO dto) {
        Hotel hotel = hotelRepository.findById(dto.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + dto.getHotelId()));

        if (roomRepository.existsByHotelIdAndRoomNumber(hotel.getId(), dto.getRoomNumber())) {
            throw new ConflictException("Room number '" + dto.getRoomNumber() + "' already exists in hotel '" + hotel.getName() + "'");
        }

        Room room = new Room();
        room.setHotel(hotel);
        mapFromRequest(room, dto);
        Room saved = roomRepository.save(room);
        return mapToResponse(saved);
    }

    public RoomResponseDTO updateRoom(Long id, RoomRequestDTO dto) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        Hotel hotel = hotelRepository.findById(dto.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + dto.getHotelId()));

        if (roomRepository.existsByHotelIdAndRoomNumberAndIdNot(hotel.getId(), dto.getRoomNumber(), id)) {
            throw new ConflictException("Room number '" + dto.getRoomNumber() + "' already exists in hotel '" + hotel.getName() + "'");
        }

        room.setHotel(hotel);
        mapFromRequest(room, dto);
        Room updated = roomRepository.save(room);
        return mapToResponse(updated);
    }

    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        boolean hasActiveBookings = reservationRepository.findByRoomIdOrderByCreatedAtDesc(id).stream()
                .anyMatch(r -> r.getStatus() == ReservationStatus.CONFIRMED || r.getStatus() == ReservationStatus.CHECKED_IN);

        if (hasActiveBookings) {
            throw new ConflictException("Cannot delete room " + room.getRoomNumber() + " because it has active reservations.");
        }

        roomRepository.delete(room);
    }

    @Transactional(readOnly = true)
    public List<RoomResponseDTO> findAvailableRooms(Long hotelId, LocalDate checkInDate, LocalDate checkOutDate,
                                                    Integer guestCount, RoomType roomType) {
        if (checkInDate == null || checkOutDate == null) {
            throw new BadRequestException("Both check-in date and check-out date are required to search room availability");
        }

        if (checkOutDate.isBefore(checkInDate) || checkOutDate.isEqual(checkInDate)) {
            throw new BadRequestException("Check-out date must be strictly later than check-in date");
        }

        List<Room> available = roomRepository.findAvailableRooms(hotelId, checkInDate, checkOutDate, guestCount, roomType);
        return available.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public Room getRoomEntity(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
    }

    public RoomResponseDTO mapToResponse(Room room) {
        return new RoomResponseDTO(
                room.getId(),
                room.getHotel().getId(),
                room.getHotel().getName(),
                room.getRoomNumber(),
                room.getRoomType(),
                room.getFloorNumber(),
                room.getMaxCapacity(),
                room.getPricePerNight(),
                room.getStatus(),
                room.getDescription(),
                room.getAmenities(),
                room.getCreatedAt()
        );
    }

    private void mapFromRequest(Room room, RoomRequestDTO dto) {
        room.setRoomNumber(dto.getRoomNumber());
        room.setRoomType(dto.getRoomType());
        room.setFloorNumber(dto.getFloorNumber());
        room.setMaxCapacity(dto.getMaxCapacity());
        room.setPricePerNight(dto.getPricePerNight());
        room.setStatus(dto.getStatus() != null ? dto.getStatus() : RoomStatus.AVAILABLE);
        room.setDescription(dto.getDescription());
        room.setAmenities(dto.getAmenities());
    }
}
