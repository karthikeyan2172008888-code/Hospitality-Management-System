package com.hospitality.controller;

import com.hospitality.dto.ApiResponse;
import com.hospitality.dto.PaymentRequestDTO;
import com.hospitality.dto.PaymentResponseDTO;
import com.hospitality.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payment Management", description = "Endpoints for recording payments and managing reservation transactions")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    @Operation(summary = "Get list of all recent payments")
    public ResponseEntity<ApiResponse<List<PaymentResponseDTO>>> getAllPayments() {
        List<PaymentResponseDTO> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @GetMapping("/reservation/{reservationId}")
    @Operation(summary = "Get all payment transactions for a specific reservation")
    public ResponseEntity<ApiResponse<List<PaymentResponseDTO>>> getPaymentsByReservation(@PathVariable Long reservationId) {
        List<PaymentResponseDTO> payments = paymentService.getPaymentsByReservationId(reservationId);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @PostMapping
    @Operation(summary = "Record a payment against a reservation")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> recordPayment(@Valid @RequestBody PaymentRequestDTO dto) {
        PaymentResponseDTO recorded = paymentService.recordPayment(dto);
        return new ResponseEntity<>(ApiResponse.success("Payment recorded successfully", recorded), HttpStatus.CREATED);
    }
}
