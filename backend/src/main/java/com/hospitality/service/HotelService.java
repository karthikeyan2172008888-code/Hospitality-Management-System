package com.hospitality.service;

import com.hospitality.dto.HotelRequestDTO;
import com.hospitality.dto.HotelResponseDTO;
import com.hospitality.entity.Hotel;
import com.hospitality.exception.ConflictException;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.repository.HotelRepository;
import com.hospitality.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;

    public HotelService(HotelRepository hotelRepository, RoomRepository roomRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
    }

    @Transactional(readOnly = true)
    public List<HotelResponseDTO> getAllHotels(String query, String city) {
        List<Hotel> hotels = hotelRepository.searchHotels(query, city);
        return hotels.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HotelResponseDTO getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        return mapToResponse(hotel);
    }

    public HotelResponseDTO createHotel(HotelRequestDTO dto) {
        Hotel hotel = new Hotel();
        mapFromRequest(hotel, dto);
        Hotel saved = hotelRepository.save(hotel);
        return mapToResponse(saved);
    }

    public HotelResponseDTO updateHotel(Long id, HotelRequestDTO dto) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        mapFromRequest(hotel, dto);
        Hotel updated = hotelRepository.save(hotel);
        return mapToResponse(updated);
    }

    public void deleteHotel(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));

        int roomCount = roomRepository.findByHotelId(id).size();
        if (roomCount > 0) {
            throw new ConflictException("Cannot delete hotel '" + hotel.getName() + "' because it currently contains "
                    + roomCount + " room(s). Delete or reassign the rooms before deleting this hotel.");
        }

        hotelRepository.delete(hotel);
    }

    public Hotel getHotelEntity(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
    }

    private HotelResponseDTO mapToResponse(Hotel hotel) {
        int roomCount = hotel.getRooms() != null ? hotel.getRooms().size() : 0;
        return new HotelResponseDTO(
                hotel.getId(),
                hotel.getName(),
                hotel.getAddress(),
                hotel.getCity(),
                hotel.getState(),
                hotel.getCountry(),
                hotel.getContactNumber(),
                hotel.getEmail(),
                hotel.getDescription(),
                hotel.getAmenities(),
                hotel.getCreatedAt(),
                roomCount
        );
    }

    private void mapFromRequest(Hotel hotel, HotelRequestDTO dto) {
        hotel.setName(dto.getName());
        hotel.setAddress(dto.getAddress());
        hotel.setCity(dto.getCity());
        hotel.setState(dto.getState());
        hotel.setCountry(dto.getCountry());
        hotel.setContactNumber(dto.getContactNumber());
        hotel.setEmail(dto.getEmail());
        hotel.setDescription(dto.getDescription());
        hotel.setAmenities(dto.getAmenities());
    }
}
