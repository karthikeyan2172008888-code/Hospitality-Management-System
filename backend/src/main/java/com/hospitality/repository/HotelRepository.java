package com.hospitality.repository;

import com.hospitality.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    List<Hotel> findByNameContainingIgnoreCaseOrCityContainingIgnoreCase(String name, String city);

    List<Hotel> findByCityIgnoreCase(String city);

    @Query("SELECT h FROM Hotel h WHERE " +
           "(:query IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(h.city) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:city IS NULL OR LOWER(h.city) = LOWER(:city))")
    List<Hotel> searchHotels(@Param("query") String query, @Param("city") String city);
}
