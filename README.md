# 🏨 Hospitality Management System — A Complete Full-Stack Hotel Management Application

> **Enterprise Property Management, Real-Time Availability Engine, Guest Registry, and Billing Ledger**  
> Developed with **React 18 & Vite**, **Java Spring Boot 3.3.4**, **Spring Data JPA / Hibernate**, and **MySQL 8.0/9.0**.  
> **Developed by KARTHIKEYAN M** | [GitHub](https://github.com/karthikeyan2172008888-code) • [LinkedIn](https://www.linkedin.com/in/karthikeyan-m-2491b1429?utm_source=share_via&utm_content=profile&utm_medium=member_android) • [Instagram](https://www.instagram.com/kxrthikeyyan?stkn=azdxb3U3YTh2MXM2)

---

## 🌟 Executive Summary & Academic Project Overview

The **Hospitality Management System** is a production-grade full-stack web application engineered to automate hotel operations, inventory tracking, guest relations, reservations, and financial transactions. Designed for multi-branch hotel groups, boutique retreats, and independent resorts, the application features an executive graphical user interface connected to a high-performance RESTful Java backend and relational MySQL database.

### Core Academic Competencies Demonstrated:
- **Three-Tier Enterprise Architecture**: Clean separation between React UI presentation layer, Spring Boot business service layer, and MySQL persistent data layer.
- **Transactional Consistency & Concurrency Protection**: Algorithmic date-overlap collision detection preventing double bookings.
- **RESTful API Standards**: Uniform JSON payloads, HTTP status semantics (200, 201, 204, 400, 404, 409), centralized exception handling, and OpenAPI 3 / Swagger documentation.
- **Relational Integrity**: Foreign key constraints, compound unique constraints `(hotel_id, room_number)`, and automated balance calculation.
- **Dual Deployment Options**: Single executable self-contained JAR (`HospitalityManagementSystem.jar`) serving both frontend and backend on port 8080, or independent dev servers with hot module replacement (HMR).

---

## 🏛️ System Architecture

```
                                      [ Hotel Admin / Desk Manager ]
                                                     │
                                                     ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PRESENTATION TIER                                    │
│   React 18  •  Vite  •  Tailwind CSS  •  Lucide Icons  •  Chart.js  •  Axios REST API   │
│   • Executive KPI Dashboard                 • Room Inventory & Date Range Checker       │
│   • Hotel Properties Directory              • Guest Profiles & Historical Stays Drawer  │
│   • 3-Step Reservation Wizard               • Billing & Payment Ledger Simulator       │
└────────────────────────────────────────────┬───────────────────────────────────────────┘
                                             │ HTTP / JSON REST APIs (Port 8080)
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                    APPLICATION TIER                                    │
│       Spring Boot 3.3.4  •  Spring MVC  •  Spring Data JPA  •  Hibernate ORM           │
│   • Controllers: Hotel, Room, Guest, Reservation, Payment, Dashboard                   │
│   • Services: Overlap Detection, Auto Billing Calculation, Safe Deletion Engine        │
│   • Repositories: Custom Spring Data JPA JPQL Queries with Temporal Comparisons        │
│   • Exception Handler: Centralized GlobalExceptionHandler with HTTP Error Mapping       │
│   • OpenAPI 3: Interactive Swagger UI at /swagger-ui.html                              │
└────────────────────────────────────────────┬───────────────────────────────────────────┘
                                             │ JDBC / HikariCP Pool
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                      DATA TIER                                         │
│                MySQL Database (hospitality_management) / Fallback Embedded H2          │
│   • hotels (ID, Name, Location, Contact, Amenities, Timestamps)                        │
│   • rooms (ID, Hotel_FK, RoomNumber, Category, Floor, Capacity, Rate, Status)           │
│   • guests (ID, FullName, Email [UNIQUE], Phone, Address, City)                        │
│   • reservations (ID, Guest_FK, Hotel_FK, Room_FK, CheckIn, CheckOut, Nights, Cost)   │
│   • payments (ID, Reservation_FK, Amount, Method [CARD/UPI/CASH], Status, TxnRef)     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Technology Stack

| Domain | Technologies |
|---|---|
| **Frontend UI** | React 18, Vite 5, Tailwind CSS / Modern CSS Variables, Lucide Icons, Chart.js, React-ChartJS-2 |
| **Backend Framework** | Java 17/21/25, Spring Boot 3.3.4, Spring Web, Spring Data JPA, Hibernate, Bean Validation |
| **Database** | MySQL Community Server 8.0/9.0, In-Memory H2 (for instant zero-dependency evaluations) |
| **Documentation & Build** | OpenAPI 3 / Swagger UI (`springdoc-openapi`), Maven 3.9, Node.js 20+ |

---

## 📋 Core Modules & Key Features

### 1. 📊 Executive Dashboard
- **Live KPI Summary**: Real-time calculated counters for Total Hotels, Total Rooms, Available Rooms, Occupied Rooms, Total Guests, Total Bookings, Active Stays, and Gross Revenue.
- **Interactive Visualizations**:
  - *Reservation & Revenue Trends*: Multi-axis line chart depicting monthly volume and financial intake.
  - *Room Status Distribution*: Doughnut chart illustrating Available vs. Occupied vs. Maintenance inventory.
- **Recent Bookings Ledger**: Live table with one-click Check-In, Check-Out, and detail examination.
- **Quick Administration Shortcuts**: Direct modal triggers for adding hotels, rooms, guests, or launching the booking wizard.

### 2. 🏨 Hotel Property Management
- Register and maintain hotel properties across multiple cities and states.
- Attributes: Name, Address, City, State, Country, Phone, Email, Description, and Amenities tags.
- **Associated Rooms Inspector**: Inspect all rooms linked to a specific hotel branch.
- **Safe Delete Protection**: Prevents deletion of hotels that contain active rooms or reservations to ensure referential integrity.

### 3. 🛏️ Room Inventory & Live Availability Engine
- Room categories: `STANDARD`, `DELUXE`, `SUITE`, `FAMILY`, `EXECUTIVE`.
- Lifecycle statuses: `AVAILABLE`, `OCCUPIED`, `MAINTENANCE`, `OUT_OF_SERVICE`.
- **Compound Uniqueness**: Guaranteed unique room numbers per individual hotel.
- **Real-Time Availability Checker**: Allows desk clerks to input target dates and party size to query available rooms in seconds.
- Rooms marked `MAINTENANCE` or `OUT_OF_SERVICE` are automatically omitted from booking search results.

### 4. 👥 Guest Directory & Stay History
- Comprehensive guest profiling: Full Name, Unique Email, Phone Number, City, and Country.
- **Stay Option & Total Stays Tracking**: View and configure the **Total Number of Stays** (`totalStays`) directly during new guest registration or profile editing, tracking prior loyalty and guest visit counts.
- **Direct Stay Booking Option**: Toggle the "Book a stay immediately for this new guest" stay option upon registration to automatically launch the 3-Step Reservation Wizard pre-selecting the guest.
- **Loyalty & Visit Badge**: Quick-glance `⭐ N Stays` badge displayed on every guest directory card and table record.
- **Reservation History Drawer**: View all historical, active, and scheduled bookings for any guest profile with balance status.
- Rapid search across guest names, email addresses, and phone numbers.

### 5. 📅 Reservation & Booking Engine
- **3-Step Guided Booking Wizard**:
  1. *Stay Parameters*: Select hotel, check-in date, check-out date, and guest count.
  2. *Room Selection*: Select an available room verified in real-time.
  3. *Guest Assignment*: Select registered guest, input special requests, review the auto-calculated cost breakdown, and confirm.
- **Automated Cost Calculation**:
  $$\text{Nights} = \text{CheckOut} - \text{CheckIn}$$
  $$\text{Total Cost} = \text{Nights} \times \text{PricePerNight}$$
- **Date-Overlap Double Booking Prevention**:
  A collision occurs if:
  $$\text{newCheckIn} < \text{existingCheckOut} \quad \text{AND} \quad \text{newCheckOut} > \text{existingCheckIn}$$
  *(Cancelled reservations do not block availability. Check-out date is treated as exclusive).*
- **Lifecycle Transitions**: `CONFIRMED` ➔ `CHECKED_IN` ➔ `CHECKED_OUT` (or `CANCELLED`).

### 6. 💳 Payment & Billing Ledger
- Supports multiple payment methods: `CARD`, `UPI`, `CASH`.
- Automatic transaction reference generation (`TXN-`, `UPI-`, `CASH-`).
- **Outstanding Balance Tracking**: Computes Total Cost, Total Paid, and Outstanding Balance Due in real-time.

---

## 🗄️ Database Setup & Initialization

### Option A: MySQL Local Database (Recommended for Production / Final Evaluation)
1. Open **MySQL Workbench** or your terminal.
2. Ensure MySQL service is running on `localhost:3306`.
3. Open and execute the script located at:
   ```
   database/database.sql
   ```
4. This script automatically creates the database `hospitality_management`, establishes the 5 tables with foreign keys and indexes, and populates realistic initial seed data (5 hotels, 25 rooms, 10 guests, 13 reservations, 11 payments).
5. Configure database credentials in `backend/src/main/resources/application.properties` or via environment variables:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

### Option B: Zero-Configuration Demo Mode (Instant Evaluation without MySQL)
If presenting on an evaluator's machine without MySQL installed, launch the application using the `--h2` flag:
```bash
# macOS / Linux:
./run.sh --h2

# Windows:
run.bat --h2
```
This runs the full application using an embedded in-memory database with the identical schema and sample data pre-loaded!

---

## 🚀 Running the Application on Localhost

### 1. Single-Command Launch (Executable Standalone JAR)
The project is pre-packaged as a self-contained Spring Boot runnable JAR containing both the backend REST API and the compiled React frontend:

```bash
# macOS / Linux
./run.sh

# Or directly with Java:
java -jar HospitalityManagementSystem.jar
```

```cmd
REM Windows
run.bat
```

Once started, navigate to:
- 🌐 **Web Management Portal**: [http://localhost:8080](http://localhost:8080)
- 📑 **Interactive Swagger Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- 🔌 **REST API Base URL**: [http://localhost:8080/api](http://localhost:8080/api)

---

### 2. Development Mode (Dual Server with Live Reload)

#### Start the Spring Boot Backend:
```bash
cd backend
./mvnw spring-boot:run
```
*(Backend runs on `http://localhost:8080`)*

#### Start the React Frontend:
```bash
cd frontend
npm install
npm run dev
```
*(Frontend runs on `http://localhost:5173` with Vite HMR and API proxying)*

---

## 🧪 Testing & Verification

Automated JUnit 5 tests verify the date-overlap detection algorithm, automated billing calculations, and capacity validation:

```bash
cd backend
./mvnw clean test
```

### Key Verified Test Cases:
1. `testCreateReservation_Success`: Verifies accurate night calculation and cost computation (`3 nights * ₹5,000 = ₹15,000`).
2. `testCreateReservation_DateOverlapConflict`: Confirms that booking an already reserved room during overlapping dates triggers HTTP 409 Conflict.
3. `testCreateReservation_CapacityExceeded`: Ensures bookings exceeding room capacity trigger HTTP 400 Bad Request.
4. `testCreateReservation_RoomInMaintenance`: Ensures rooms marked `MAINTENANCE` cannot be booked.

---

## 📁 Project Directory Structure

```
HospitalityManagementSystem/
├── HospitalityManagementSystem.jar   # Runnable full-stack standalone JAR
├── HospitalityManagementSystem.zip   # Complete academic submission archive
├── run.sh                            # Unix/macOS one-click launcher
├── run.bat                           # Windows one-click launcher
├── README.md                         # Comprehensive project documentation
│
├── database/
│   └── database.sql                  # MySQL database creation & seed data script
│
├── documentation/
│   └── API_DOCUMENTATION.md          # Full REST API endpoint reference
│
├── backend/
│   ├── pom.xml                       # Maven dependencies & plugins
│   ├── mvnw                          # Portable Maven wrapper
│   └── src/
│       ├── main/java/com/hospitality/
│       │   ├── HospitalityApplication.java
│       │   ├── config/               # CORS, OpenAPI, SPA routing
│       │   ├── controller/           # REST Controllers
│       │   ├── dto/                  # Request/Response Data Transfer Objects
│       │   ├── entity/               # JPA Entities & Enums
│       │   ├── exception/            # Global Exception Handling
│       │   ├── repository/           # Spring Data JPA Repositories
│       │   └── service/              # Core Business Logic & Algorithms
│       └── main/resources/
│           ├── application.properties
│           ├── application-h2.properties
│           ├── data.sql
│           └── static/               # Bundled production React frontend build
│
└── frontend/
    ├── package.json                  # React, Vite, Lucide, Chart.js dependencies
    ├── vite.config.js                # Vite build & proxy configuration
    ├── index.html                    # Root HTML document
    └── src/
        ├── main.jsx                  # React entry point
        ├── App.jsx                   # Main layout and tab orchestrator
        ├── index.css                 # Custom hospitality design system
        ├── api/                      # Centralized REST API client
        ├── components/               # Navbar, Sidebar, Modal, Badge, Toast
```

---

## 👨‍💻 Developer Information

The **Hospitality Management System** was architected and developed by:

### **KARTHIKEYAN M**
*Full-Stack Software Engineer*

- 🌐 **GitHub**: [github.com/karthikeyan2172008888-code](https://github.com/karthikeyan2172008888-code)
- 💼 **LinkedIn**: [linkedin.com/in/karthikeyan-m-2491b1429](https://www.linkedin.com/in/karthikeyan-m-2491b1429?utm_source=share_via&utm_content=profile&utm_medium=member_android)
- 📸 **Instagram**: [@kxrthikeyyan](https://www.instagram.com/kxrthikeyyan?stkn=azdxb3U3YTh2MXM2)

---
© 2026 Hospitality Management System. Developed by KARTHIKEYAN M. All rights reserved.

