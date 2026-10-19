-- ===================================================================
-- CampusConnect MySQL Database Schema (DDL)
-- ===================================================================

CREATE DATABASE IF NOT EXISTS campusconnect;
USE campusconnect;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'STUDENT',
    department VARCHAR(150),
    avatar VARCHAR(50) DEFAULT '👨‍🎓',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clubs Table
CREATE TABLE IF NOT EXISTS clubs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    discipline VARCHAR(80),
    category VARCHAR(80),
    icon VARCHAR(30),
    description TEXT,
    members INT DEFAULT 0,
    coordinator VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Club Activities Table
CREATE TABLE IF NOT EXISTS club_activities (
    club_id BIGINT NOT NULL,
    activity VARCHAR(150) NOT NULL,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

-- 4. Events Table
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(80) NOT NULL,
    date VARCHAR(20) NOT NULL,
    time VARCHAR(30) NOT NULL,
    venue VARCHAR(200) NOT NULL,
    organizer_club VARCHAR(150) NOT NULL,
    capacity INT NOT NULL DEFAULT 100,
    registered_count INT NOT NULL DEFAULT 0,
    banner_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    student_name VARCHAR(150),
    student_email VARCHAR(150),
    student_department VARCHAR(150),
    ticket_code VARCHAR(100) NOT NULL UNIQUE,
    registered_at VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(30) NOT NULL DEFAULT 'MEDIUM',
    content TEXT NOT NULL,
    author VARCHAR(150) DEFAULT 'Campus Administration',
    created_at VARCHAR(30)
);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_reg_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_reg_user ON registrations(user_id);
