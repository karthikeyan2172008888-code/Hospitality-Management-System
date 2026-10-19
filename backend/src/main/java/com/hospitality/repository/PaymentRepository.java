package com.hospitality.repository;

import com.hospitality.entity.Payment;
import com.hospitality.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByReservationIdOrderByPaymentDateDesc(Long reservationId);

    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);

    List<Payment> findTop20ByOrderByPaymentDateDesc();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p " +
           "WHERE p.reservation.id = :reservationId AND p.paymentStatus = 'COMPLETED'")
    BigDecimal sumCompletedPaymentsByReservationId(@Param("reservationId") Long reservationId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'COMPLETED'")
    BigDecimal sumTotalRevenue();
}
