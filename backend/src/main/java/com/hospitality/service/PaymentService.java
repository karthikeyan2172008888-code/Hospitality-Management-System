package com.hospitality.service;

import com.hospitality.dto.PaymentRequestDTO;
import com.hospitality.dto.PaymentResponseDTO;
import com.hospitality.entity.Payment;
import com.hospitality.entity.PaymentStatus;
import com.hospitality.entity.Reservation;
import com.hospitality.exception.BadRequestException;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.repository.PaymentRepository;
import com.hospitality.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    public PaymentService(PaymentRepository paymentRepository, ReservationRepository reservationRepository) {
        this.paymentRepository = paymentRepository;
        this.reservationRepository = reservationRepository;
    }

    @Transactional(readOnly = true)
    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findTop20ByOrderByPaymentDateDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentResponseDTO> getPaymentsByReservationId(Long reservationId) {
        return paymentRepository.findByReservationIdOrderByPaymentDateDesc(reservationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PaymentResponseDTO recordPayment(PaymentRequestDTO dto) {
        Reservation reservation = reservationRepository.findById(dto.getReservationId())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + dto.getReservationId()));

        if (dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Payment amount must be greater than zero");
        }

        String txnRef = dto.getTransactionReference();
        if (txnRef == null || txnRef.trim().isEmpty()) {
            String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            txnRef = dto.getPaymentMethod().name() + "-" + datePrefix + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }

        Payment payment = new Payment();
        payment.setReservation(reservation);
        payment.setAmount(dto.getAmount());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentStatus(PaymentStatus.COMPLETED);
        payment.setTransactionReference(txnRef);

        Payment saved = paymentRepository.save(payment);
        return mapToResponse(saved);
    }

    private PaymentResponseDTO mapToResponse(Payment p) {
        return new PaymentResponseDTO(
                p.getId(),
                p.getReservation().getId(),
                p.getReservation().getGuest().getFullName(),
                p.getReservation().getHotel().getName(),
                p.getReservation().getRoom().getRoomNumber(),
                p.getAmount(),
                p.getPaymentDate(),
                p.getPaymentMethod(),
                p.getPaymentStatus(),
                p.getTransactionReference(),
                p.getCreatedAt()
        );
    }
}
