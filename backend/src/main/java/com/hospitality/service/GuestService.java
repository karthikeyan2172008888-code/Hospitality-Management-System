package com.hospitality.service;

import com.hospitality.dto.GuestRequestDTO;
import com.hospitality.dto.GuestResponseDTO;
import com.hospitality.entity.Guest;
import com.hospitality.entity.ReservationStatus;
import com.hospitality.exception.ConflictException;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.repository.GuestRepository;
import com.hospitality.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GuestService {

    private final GuestRepository guestRepository;
    private final ReservationRepository reservationRepository;

    public GuestService(GuestRepository guestRepository, ReservationRepository reservationRepository) {
        this.guestRepository = guestRepository;
        this.reservationRepository = reservationRepository;
    }

    @Transactional(readOnly = true)
    public List<GuestResponseDTO> getAllGuests(String query) {
        List<Guest> guests = guestRepository.searchGuests(query);
        return guests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GuestResponseDTO getGuestById(Long id) {
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found with id: " + id));
        return mapToResponse(guest);
    }

    public GuestResponseDTO registerGuest(GuestRequestDTO dto) {
        if (guestRepository.existsByEmail(dto.getEmail())) {
            throw new ConflictException("A guest with email '" + dto.getEmail() + "' is already registered");
        }

        Guest guest = new Guest();
        mapFromRequest(guest, dto);
        Guest saved = guestRepository.save(guest);
        return mapToResponse(saved);
    }

    public GuestResponseDTO updateGuest(Long id, GuestRequestDTO dto) {
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found with id: " + id));

        if (guestRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
            throw new ConflictException("Email '" + dto.getEmail() + "' is already associated with another guest profile");
        }

        mapFromRequest(guest, dto);
        Guest updated = guestRepository.save(guest);
        return mapToResponse(updated);
    }

    public void deleteGuest(Long id) {
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found with id: " + id));

        boolean hasActiveBookings = reservationRepository.findByGuestIdOrderByCreatedAtDesc(id).stream()
                .anyMatch(r -> r.getStatus() == ReservationStatus.CONFIRMED || r.getStatus() == ReservationStatus.CHECKED_IN);

        if (hasActiveBookings) {
            throw new ConflictException("Cannot delete guest '" + guest.getFullName() + "' because they have active reservations.");
        }

        guestRepository.delete(guest);
    }

    public Guest getGuestEntity(Long id) {
        return guestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found with id: " + id));
    }

    public GuestResponseDTO mapToResponse(Guest guest) {
        int bookingCount = guest.getReservations() != null ? guest.getReservations().size() : 0;
        int totalStays = (guest.getTotalStays() != null ? guest.getTotalStays() : 0) + bookingCount;
        GuestResponseDTO dto = new GuestResponseDTO(
                guest.getId(),
                guest.getFullName(),
                guest.getEmail(),
                guest.getPhoneNumber(),
                guest.getAddress(),
                guest.getCity(),
                guest.getCountry(),
                guest.getRegistrationDate(),
                totalStays
        );
        dto.setTotalStays(totalStays);
        return dto;
    }

    private void mapFromRequest(Guest guest, GuestRequestDTO dto) {
        guest.setFullName(dto.getFullName());
        guest.setEmail(dto.getEmail());
        guest.setPhoneNumber(dto.getPhoneNumber());
        guest.setAddress(dto.getAddress());
        guest.setCity(dto.getCity());
        guest.setCountry(dto.getCountry());
        if (dto.getTotalStays() != null) {
            guest.setTotalStays(dto.getTotalStays());
        }
    }
}
