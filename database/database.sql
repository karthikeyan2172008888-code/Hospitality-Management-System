-- ============================================================================
-- Hospitality Management System — Database Initialization Script
-- Database: hospitality_management
-- Compatibility: MySQL 8.0+ / 9.0+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS hospitality_management
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE hospitality_management;

-- ----------------------------------------------------------------------------
-- 1. Table: hotels
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS guests;
DROP TABLE IF EXISTS hotels;

CREATE TABLE hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    description TEXT,
    amenities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_hotel_city (city),
    INDEX idx_hotel_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Table: rooms
-- ----------------------------------------------------------------------------
CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    floor_number INT NOT NULL,
    max_capacity INT NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    description TEXT,
    amenities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_room_hotel FOREIGN KEY (hotel_id) REFERENCES hotels (id) ON DELETE RESTRICT,
    CONSTRAINT uk_hotel_room_number UNIQUE (hotel_id, room_number),
    INDEX idx_room_status (status),
    INDEX idx_room_type (room_type),
    INDEX idx_room_price (price_per_night)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Table: guests
-- ----------------------------------------------------------------------------
CREATE TABLE guests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(30) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    total_stays INT DEFAULT 0,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_guest_email (email),
    INDEX idx_guest_phone (phone_number),
    INDEX idx_guest_name (full_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Table: reservations
-- ----------------------------------------------------------------------------
CREATE TABLE reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    guest_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INT NOT NULL,
    number_of_nights INT NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservation_guest FOREIGN KEY (guest_id) REFERENCES guests (id) ON DELETE RESTRICT,
    CONSTRAINT fk_reservation_hotel FOREIGN KEY (hotel_id) REFERENCES hotels (id) ON DELETE RESTRICT,
    CONSTRAINT fk_reservation_room FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE RESTRICT,
    INDEX idx_reservation_dates (room_id, check_in_date, check_out_date, status),
    INDEX idx_reservation_status (status),
    INDEX idx_reservation_guest (guest_id),
    INDEX idx_reservation_hotel (hotel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Table: payments
-- ----------------------------------------------------------------------------
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    transaction_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_reservation FOREIGN KEY (reservation_id) REFERENCES reservations (id) ON DELETE CASCADE,
    INDEX idx_payment_reservation (reservation_id),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================

-- 1. Hotels
INSERT INTO hotels (id, name, address, city, state, country, contact_number, email, description, amenities) VALUES
(1, 'Grand Horizon Palace', '124 Marine Drive', 'Mumbai', 'Maharashtra', 'India', '+91 22 2845 9000', 'stay@grandhorizon.com', 'Iconic 5-star waterfront luxury hotel overlooking the Arabian Sea with world-class hospitality.', 'Free WiFi, Infinity Pool, Spa & Wellness, Fitness Center, 24/7 Room Service, Multi-cuisine Restaurant, Valet Parking'),
(2, 'Azure Bay Luxury Resort', '45 Baga Beach Road', 'Calangute', 'Goa', 'India', '+91 832 278 4400', 'contact@azurebayresort.com', 'A beachfront tropical haven with private sun decks, lagoon swimming pool, and coastal dining.', 'Free WiFi, Beachfront Access, Swimming Pool, Beach Bar, Water Sports Center, Free Breakfast, Airport Shuttle'),
(3, 'Royal Heritage Haveli', '18 Amer Fort Road', 'Jaipur', 'Rajasthan', 'India', '+91 141 267 8900', 'reservations@royalhaveli.com', 'Restored 19th-century royal mansion reflecting timeless Rajasthani grandeur and aristocratic comfort.', 'Free WiFi, Traditional Dining, Cultural Performances, Courtyard Garden, Ayurvedic Spa, Rooftop Lounge, Boutique Shop'),
(4, 'The Serene Pine Retreat', 'Old Manali Hills', 'Manali', 'Himachal Pradesh', 'India', '+91 1902 254 321', 'info@serenepineretreat.com', 'Picturesque alpine chalet nestled among cedar pines offering snow-capped Himalayan panoramas.', 'Free WiFi, Fireplace Lounge, Heated Rooms, Mountain View Balcony, Trekking Guide, Cafe, Bonfire Area'),
(5, 'Silicon Central Suites', '88 Indiranagar 100ft Road', 'Bengaluru', 'Karnataka', 'India', '+91 80 4120 7700', 'frontdesk@siliconcentral.com', 'Modern upscale business hotel designed for tech innovators, corporate leaders, and urban travelers.', 'High-Speed WiFi, Co-working Lounge, Conference Rooms, Fitness Center, Specialty Coffee Bar, EV Charging Station');

-- 2. Rooms
INSERT INTO rooms (id, hotel_id, room_number, room_type, floor_number, max_capacity, price_per_night, status, description, amenities) VALUES
-- Grand Horizon Palace (Hotel 1)
(1, 1, '101', 'STANDARD', 1, 2, 4500.00, 'AVAILABLE', 'Well-appointed comfortable room with garden views and modern work desk.', 'Queen Bed, AC, High-Speed WiFi, Smart TV, Tea/Coffee Maker'),
(2, 1, '102', 'STANDARD', 1, 2, 4500.00, 'AVAILABLE', 'Spacious standard room featuring ergonomic workstation and sleek bath.', 'Queen Bed, AC, High-Speed WiFi, Smart TV, Mini Fridge'),
(3, 1, '201', 'DELUXE', 2, 2, 7500.00, 'AVAILABLE', 'Deluxe sea-facing room with private glass balcony and rainfall shower.', 'King Bed, Ocean View, Private Balcony, Bathtub, Espresso Machine, Mini Bar'),
(4, 1, '202', 'DELUXE', 2, 3, 8000.00, 'OCCUPIED', 'Premium deluxe suite with extra rollaway bed option and city skyline vistas.', 'King Bed + Daybed, City View, Bathtub, High-Speed WiFi, Mini Bar'),
(5, 1, '301', 'SUITE', 3, 4, 14000.00, 'OCCUPIED', 'Signature presidential suite with separate living parlor and dining area.', 'Master King Bed, Living Room, Dining Table, Jacuzzi, Panoramic Sea View, Butler Service'),
(6, 1, '302', 'EXECUTIVE', 3, 2, 11000.00, 'AVAILABLE', 'High-floor executive corner room with complimentary club lounge access.', 'King Bed, Executive Lounge Access, Workstation, Smart Lighting, Luxury Toiletries'),

-- Azure Bay Luxury Resort (Hotel 2)
(7, 2, 'G-01', 'DELUXE', 1, 2, 6500.00, 'AVAILABLE', 'Ground level garden cabana room with immediate access to tropical lawns.', 'King Bed, Garden Patio, Outdoor Rain Shower, Hammock, Mini Bar'),
(8, 2, 'G-02', 'DELUXE', 1, 2, 6500.00, 'AVAILABLE', 'Poolside cabana room with private patio stepping right into pool terrace.', 'King Bed, Pool Terrace Access, AC, Smart TV, Bluetooth Soundbar'),
(9, 2, 'F-11', 'SUITE', 2, 4, 12500.00, 'AVAILABLE', 'Coastal family suite featuring master bedroom, twin beds room, and sun deck.', 'King Bed + 2 Twin Beds, Ocean View Terrace, Kitchenette, Jacuzzi, Free Breakfast'),
(10, 2, 'F-12', 'FAMILY', 2, 5, 9500.00, 'AVAILABLE', 'Expansive family room with interconnected spaces and bunk beds for kids.', '2 Queen Beds + Bunk Bed, Play Area, Smart TV, Mini Fridge, Microwave'),
(11, 2, 'B-01', 'STANDARD', 1, 2, 3800.00, 'MAINTENANCE', 'Standard room currently under scheduled HVAC modernization and painting.', 'Queen Bed, AC, Smart TV, Free WiFi'),

-- Royal Heritage Haveli (Hotel 3)
(12, 3, '101', 'DELUXE', 1, 2, 5800.00, 'AVAILABLE', 'Traditional royal room with ornate jharokha windows and handcrafted teak bed.', 'Teak King Bed, Heritage Decor, Marble Bathroom, Courtyard View'),
(13, 3, '102', 'DELUXE', 1, 2, 5800.00, 'AVAILABLE', 'Charming heritage room featuring fresco ceiling murals and brass fixtures.', 'Teak King Bed, Fresco Paintings, AC, Heritage Sitting Alcove'),
(14, 3, '201', 'SUITE', 2, 3, 10500.00, 'AVAILABLE', 'Maharaja Suite with antique chandeliers, private balcony, and royal divan.', 'Four-Poster King Bed, Antique Divan, Amber Fort View, Clawfoot Tub'),
(15, 3, '202', 'EXECUTIVE', 2, 2, 8500.00, 'AVAILABLE', 'Executive royal retreat with private courtyard terrace and writing bureau.', 'King Bed, Private Terrace, Custom Inlay Desk, Mini Bar, Herbal Toiletries'),

-- The Serene Pine Retreat (Manali - Hotel 4)
(16, 4, '101', 'STANDARD', 1, 2, 3200.00, 'AVAILABLE', 'Cozy wooden alpine chamber with radiant heating and pine forest views.', 'Double Bed, Wooden Paneling, Room Heater, Tea Kettle, Forest View'),
(17, 4, '102', 'STANDARD', 1, 2, 3200.00, 'AVAILABLE', 'Heated cottage room with natural cedar scent and rustic mountain vibe.', 'Double Bed, Mountain View, Heater, Smart TV, High-Speed WiFi'),
(18, 4, '201', 'DELUXE', 2, 2, 5200.00, 'AVAILABLE', 'Upper floor attic room with private snow-peak observation balcony.', 'King Bed, Private Balcony, Electric Blanket, Coffee Maker, Mountain View'),
(19, 4, '202', 'FAMILY', 2, 4, 7800.00, 'AVAILABLE', 'Spacious duplex chalet room accommodating parents and children comfortably.', 'King Bed + Loft Twin Beds, Fireplace, Board Games, Heated Flooring'),
(20, 4, '301', 'SUITE', 3, 3, 9800.00, 'OUT_OF_SERVICE', 'Penthouse cedar suite temporarily offline for annual chimney insulation repair.', 'King Bed, Stone Fireplace, Glass Roof Skylight, Jacuzzi'),

-- Silicon Central Suites (Bengaluru - Hotel 5)
(21, 5, '401', 'STANDARD', 4, 1, 3600.00, 'AVAILABLE', 'Efficient business studio with high-speed fiber internet and standing desk.', 'Queen Bed, Motorized Standing Desk, Ergonomic Chair, 4K Monitor, AC'),
(22, 5, '402', 'STANDARD', 4, 2, 4000.00, 'AVAILABLE', 'Sleek contemporary twin room suitable for business associates or travelers.', '2 Twin Beds, Fast WiFi, USB-C Charging Hub, Smart TV, Safe'),
(23, 5, '501', 'EXECUTIVE', 5, 2, 6800.00, 'AVAILABLE', 'Executive corner suite with soundproof glass and panoramic city views.', 'King Bed, Acoustic Insulation, Conference Table, Nespresso, Lounge Access'),
(24, 5, '502', 'EXECUTIVE', 5, 2, 6800.00, 'AVAILABLE', 'Smart tech suite with automated ambient lighting and voice controls.', 'King Bed, Smart Automation, Herman Miller Chair, Dyson Air Purifier'),
(25, 5, '601', 'SUITE', 6, 3, 11500.00, 'AVAILABLE', 'Penthouse executive apartment with kitchenette, private lounge, and skyline terrace.', 'King Bed, Living Lounge, Kitchenette, 65-inch OLED TV, Wine Chiller');

-- 3. Guests
INSERT INTO guests (id, full_name, email, phone_number, address, city, country, total_stays) VALUES
(1, 'Aarav Sharma', 'aarav.sharma@example.com', '+91 98201 12345', '42 Palm Avenue, Bandra West', 'Mumbai', 'India', 2),
(2, 'Priya Patel', 'priya.patel@example.com', '+91 97123 45678', '15 Sunset Boulevard', 'Ahmedabad', 'India', 2),
(3, 'Rohan Verma', 'rohan.verma@example.com', '+91 98110 54321', '88 Defence Colony', 'New Delhi', 'India', 1),
(4, 'Ananya Iyer', 'ananya.iyer@example.com', '+91 94440 98765', '23 Anna Salai', 'Chennai', 'India', 1),
(5, 'Vikram Sengupta', 'vikram.sengupta@example.com', '+91 98300 23456', '7 Southern Avenue', 'Kolkata', 'India', 1),
(6, 'Sneha Kulkarni', 'sneha.kulkarni@example.com', '+91 98810 65432', '102 Senapati Bapat Road', 'Pune', 'India', 1),
(7, 'David Miller', 'david.miller@example.com', '+1 415 555 0192', '742 Evergreen Terrace', 'San Francisco', 'USA', 1),
(8, 'Elena Rostova', 'elena.rostova@example.com', '+44 20 7946 0912', '14 Kensington High St', 'London', 'UK', 1),
(9, 'Kabir Mehta', 'kabir.mehta@example.com', '+91 98450 11223', '34 Koramangala 4th Block', 'Bengaluru', 'India', 1),
(10, 'Neha Kapoor', 'neha.kapoor@example.com', '+91 98760 33445', '56 Civil Lines', 'Chandigarh', 'India', 1);

-- 4. Reservations
-- Note: Uses current year dates (2026/2027) so future availability queries behave correctly
INSERT INTO reservations (id, guest_id, hotel_id, room_id, booking_date, check_in_date, check_out_date, number_of_guests, number_of_nights, price_per_night, total_cost, status, special_requests) VALUES
-- Past stays (Checked Out)
(1, 1, 1, 1, '2026-09-01 10:30:00', '2026-09-10', '2026-09-13', 2, 3, 4500.00, 13500.00, 'CHECKED_OUT', 'Quiet room away from elevators.'),
(2, 2, 2, 7, '2026-09-05 14:15:00', '2026-09-15', '2026-09-18', 2, 3, 6500.00, 19500.00, 'CHECKED_OUT', 'Late checkout requested if possible.'),
(3, 3, 3, 12, '2026-09-12 11:00:00', '2026-09-20', '2026-09-22', 2, 2, 5800.00, 11600.00, 'CHECKED_OUT', 'Vegetarian breakfast options preferred.'),
(4, 4, 4, 16, '2026-09-18 16:40:00', '2026-09-25', '2026-09-28', 2, 3, 3200.00, 9600.00, 'CHECKED_OUT', 'Arrangement for Manali trekking map.'),

-- Currently active stays (Checked In)
(5, 5, 1, 4, '2026-10-05 09:20:00', '2026-10-10', '2026-10-14', 3, 4, 8000.00, 32000.00, 'CHECKED_IN', 'Extra rollaway bed and baby cot.'),
(6, 6, 1, 5, '2026-10-06 12:45:00', '2026-10-11', '2026-10-15', 2, 4, 14000.00, 56000.00, 'CHECKED_IN', 'Honeymoon flower decoration in suite.'),

-- Upcoming future stays (Confirmed)
(7, 7, 2, 8, '2026-10-08 17:10:00', '2026-10-20', '2026-10-25', 2, 5, 6500.00, 32500.00, 'CONFIRMED', 'Airport pickup from Dabolim airport.'),
(8, 8, 3, 14, '2026-10-09 18:30:00', '2026-10-22', '2026-10-26', 2, 4, 10500.00, 42000.00, 'CONFIRMED', 'Heritage city tour guide recommendation.'),
(9, 9, 5, 23, '2026-10-10 08:50:00', '2026-10-18', '2026-10-21', 1, 3, 6800.00, 20400.00, 'CONFIRMED', 'High-speed LAN cable required in room.'),
(10, 10, 4, 18, '2026-10-10 15:00:00', '2026-11-01', '2026-11-05', 2, 4, 5200.00, 20800.00, 'CONFIRMED', 'Heated blankets and fireplace logs.'),
(11, 1, 2, 9, '2026-10-11 11:20:00', '2026-11-10', '2026-11-14', 4, 4, 12500.00, 50000.00, 'CONFIRMED', 'Family holiday, require ground floor assistance.'),
(12, 2, 5, 24, '2026-10-11 13:00:00', '2026-11-15', '2026-11-18', 2, 3, 6800.00, 20400.00, 'CONFIRMED', 'Corporate invoice with GST number.'),

-- Cancelled reservation (Demonstrating availability unblocking)
(13, 3, 1, 3, '2026-10-01 10:00:00', '2026-10-15', '2026-10-18', 2, 3, 7500.00, 22500.00, 'CANCELLED', 'Client cancelled due to urgent business conflict.');

-- 5. Payments
INSERT INTO payments (id, reservation_id, amount, payment_date, payment_method, payment_status, transaction_reference) VALUES
-- Past completed payments
(1, 1, 13500.00, '2026-09-10 10:35:00', 'CARD', 'COMPLETED', 'TXN-HOSP-20260910-01'),
(2, 2, 19500.00, '2026-09-15 14:20:00', 'UPI', 'COMPLETED', 'UPI-HOSP-20260915-02'),
(3, 3, 11600.00, '2026-09-20 11:05:00', 'CASH', 'COMPLETED', 'CASH-REC-20260920-03'),
(4, 4, 9600.00, '2026-09-25 16:45:00', 'CARD', 'COMPLETED', 'TXN-HOSP-20260925-04'),

-- Current active stay payments (Full and Partial)
(5, 5, 32000.00, '2026-10-10 09:30:00', 'CARD', 'COMPLETED', 'TXN-HOSP-20261010-05'),
(6, 6, 30000.00, '2026-10-11 12:50:00', 'UPI', 'COMPLETED', 'UPI-HOSP-20261011-06'), -- Partial payment (Balance 26,000 pending)

-- Future reservations payments
(7, 7, 10000.00, '2026-10-08 17:15:00', 'CARD', 'COMPLETED', 'TXN-HOSP-20261008-07'), -- Advance deposit
(8, 8, 42000.00, '2026-10-09 18:35:00', 'UPI', 'COMPLETED', 'UPI-HOSP-20261009-08'),
(9, 9, 20400.00, '2026-10-10 08:55:00', 'CARD', 'COMPLETED', 'TXN-HOSP-20261010-09'),
(10, 10, 5000.00, '2026-10-10 15:05:00', 'UPI', 'COMPLETED', 'UPI-HOSP-20261010-10'), -- Partial deposit

-- Refunded payment for cancelled reservation
(11, 13, 22500.00, '2026-10-01 10:05:00', 'CARD', 'REFUNDED', 'REF-HOSP-20261002-13');

-- Reset auto_increment pointers safely
ALTER TABLE hotels AUTO_INCREMENT = 100;
ALTER TABLE rooms AUTO_INCREMENT = 100;
ALTER TABLE guests AUTO_INCREMENT = 100;
ALTER TABLE reservations AUTO_INCREMENT = 100;
ALTER TABLE payments AUTO_INCREMENT = 100;
