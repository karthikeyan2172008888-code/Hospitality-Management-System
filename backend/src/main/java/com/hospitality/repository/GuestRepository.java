package com.hospitality.repository;

import com.hospitality.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {

    Optional<Guest> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    @Query("SELECT g FROM Guest g WHERE " +
           ":query IS NULL OR " +
           "LOWER(g.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(g.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(g.phoneNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(g.city) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Guest> searchGuests(@Param("query") String query);
}
