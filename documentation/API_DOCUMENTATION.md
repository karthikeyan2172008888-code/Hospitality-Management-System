# 📖 Hospitality Management System — REST API Documentation

The **Hospitality Management System** provides a comprehensive RESTful API built with **Spring Boot 3.3.4** and documented with **OpenAPI 3 / Swagger**.

---

## 🌐 Base URL & Interactive Swagger UI

- **Base URL**: `http://localhost:8080/api`
- **Interactive Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON Spec**: `http://localhost:8080/v3/api-docs`

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-10-11T19:15:38.275851"
}
```

### Error Response
```json
{
  "timestamp": "2026-10-11T19:16:13.220302",
  "status": 409,
  "error": "Conflict",
  "message": "Room is unavailable for requested dates. Conflicting booking exists from 2026-10-20 to 2026-10-25 (Reservation #7)",
  "path": "/api/reservations"
}
```

---

## 1. 🏨 Hotel Management APIs

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/hotels` | Retrieve all hotels with optional `query` & `city` search | 200 |
| `GET` | `/api/hotels/{id}` | Retrieve specific hotel details | 200, 404 |
| `POST` | `/api/hotels` | Create a new hotel property | 201, 400 |
| `PUT` | `/api/hotels/{id}` | Update existing hotel information | 200, 400, 404 |
| `DELETE` | `/api/hotels/{id}` | Safe delete hotel (blocked if rooms exist) | 200, 404, 409 |

### Create Hotel Payload (`POST /api/hotels`)
```json
{
  "name": "Grand Horizon Palace",
  "address": "124 Marine Drive",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "contactNumber": "+91 22 2845 9000",
  "email": "stay@grandhorizon.com",
  "description": "5-star luxury hotel overlooking the Arabian Sea.",
  "amenities": "Free WiFi, Infinity Pool, Spa, Gym, Multi-cuisine Restaurant, Parking"
}
```

---

## 2. 🛏️ Room Management APIs

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/rooms` | Retrieve rooms (filter by `hotelId`, `roomType`, `status`, `roomNumber`) | 200 |
| `GET` | `/api/rooms/{id}` | Retrieve specific room details | 200, 404 |
| `GET` | `/api/rooms/hotel/{hotelId}` | Retrieve all rooms in a given hotel | 200 |
| `GET` | `/api/rooms/available` | **Search available rooms** based on dates, hotel, and guest count | 200, 400 |
| `POST` | `/api/rooms` | Add a new room (unique room number per hotel enforced) | 201, 400, 409 |
| `PUT` | `/api/rooms/{id}` | Update room information | 200, 400, 404, 409 |
| `DELETE` | `/api/rooms/{id}` | Delete room (blocked if active reservations exist) | 200, 404, 409 |

### Search Available Rooms Query (`GET /api/rooms/available`)
```
GET /api/rooms/available?hotelId=1&checkInDate=2026-11-01&checkOutDate=2026-11-05&guestCount=2
```

### Add Room Payload (`POST /api/rooms`)
```json
{
  "hotelId": 1,
  "roomNumber": "101",
  "roomType": "STANDARD",
  "floorNumber": 1,
  "maxCapacity": 2,
  "pricePerNight": 4500.00,
  "status": "AVAILABLE",
  "description": "Garden-view standard room with executive desk.",
  "amenities": "Queen Bed, AC, High-Speed WiFi, Smart TV"
}
```

---

## 3. 👥 Guest Management APIs

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/guests` | Retrieve all guests with optional query search | 200 |
| `GET` | `/api/guests/{id}` | Retrieve guest profile by ID | 200, 404 |
| `GET` | `/api/guests/{id}/reservations` | Retrieve full booking history of a guest | 200, 404 |
| `POST` | `/api/guests` | Register a new guest (unique email enforced) | 201, 400, 409 |
| `PUT` | `/api/guests/{id}` | Update guest profile | 200, 400, 404, 409 |
| `DELETE` | `/api/guests/{id}` | Delete guest (blocked if active stays exist) | 200, 404, 409 |

### Register Guest Payload (`POST /api/guests`)
```json
{
  "fullName": "Aarav Sharma",
  "email": "aarav.sharma@example.com",
  "phoneNumber": "+91 98201 12345",
  "address": "42 Palm Avenue, Bandra West",
  "city": "Mumbai",
  "country": "India",
  "totalStays": 3
}
```

---

## 4. 📅 Reservation & Booking Engine APIs

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/reservations` | Retrieve reservations (filter by `hotelId`, `status`, `guestQuery`) | 200 |
| `GET` | `/api/reservations/{id}` | Retrieve specific reservation with payment balance breakdown | 200, 404 |
| `POST` | `/api/reservations` | **Create reservation with date-overlap protection & auto cost calculation** | 201, 400, 409 |
| `PUT` | `/api/reservations/{id}` | Update reservation details | 200, 400, 404, 409 |
| `PATCH` | `/api/reservations/{id}/status` | Update status (`CHECKED_IN`, `CHECKED_OUT`) | 200, 404 |
| `PATCH` | `/api/reservations/{id}/cancel` | Cancel booking and release room availability | 200, 404 |
| `DELETE` | `/api/reservations/{id}` | Delete reservation record | 200, 404 |

### Create Reservation Payload (`POST /api/reservations`)
```json
{
  "guestId": 1,
  "hotelId": 2,
  "roomId": 8,
  "checkInDate": "2026-10-25",
  "checkOutDate": "2026-10-28",
  "numberOfGuests": 2,
  "specialRequests": "Ocean view balcony and late checkout requested."
}
```

### Date Overlap Algorithm Rule:
A booking conflict is triggered if:
$$\text{newCheckIn} < \text{existingCheckOut} \quad \text{AND} \quad \text{newCheckOut} > \text{existingCheckIn}$$
Where existing status is NOT `CANCELLED`.
*Note: Check-out date is exclusive, allowing turnaround on the same day.*

---

## 5. 💳 Payment & Billing Ledger APIs

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/payments` | Retrieve recent payment transactions | 200 |
| `GET` | `/api/payments/reservation/{resId}` | Retrieve all payments for a specific reservation | 200 |
| `POST` | `/api/payments` | Record payment against a reservation | 201, 400, 404 |

### Record Payment Payload (`POST /api/payments`)
```json
{
  "reservationId": 14,
  "amount": 10000.00,
  "paymentMethod": "UPI",
  "transactionReference": "UPI-20261011-2D13D08A"
}
```

---

## 6. 📊 Dashboard & Analytics APIs

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/dashboard/summary` | Real-time counters (hotels, rooms, available, occupied, guests, revenue) | 200 |
| `GET` | `/api/dashboard/recent-reservations` | 10 most recent bookings with status and totals | 200 |
| `GET` | `/api/dashboard/reservation-trends` | Monthly booking volume and revenue trends | 200 |
| `GET` | `/api/dashboard/occupancy-stats` | Room distribution across Available, Occupied, Maintenance | 200 |

---

## 👨‍💻 Developed by KARTHIKEYAN M

- **GitHub Profile**: [https://github.com/karthikeyan2172008888-code](https://github.com/karthikeyan2172008888-code)
- **LinkedIn Profile**: [https://www.linkedin.com/in/karthikeyan-m-2491b1429](https://www.linkedin.com/in/karthikeyan-m-2491b1429?utm_source=share_via&utm_content=profile&utm_medium=member_android)
- **Instagram Profile**: [https://www.instagram.com/kxrthikeyyan](https://www.instagram.com/kxrthikeyyan?stkn=azdxb3U3YTh2MXM2)

