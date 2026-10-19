-- ===================================================================
-- CampusConnect Initial Seed Data
-- ===================================================================

USE campusconnect;

-- Insert Seed Users
INSERT INTO users (id, name, email, password, role, department, avatar) VALUES
(1, 'Alex Turner', 'alex@campus.edu', 'password123', 'STUDENT', 'Computer Science & Engineering', '👨‍🎓'),
(2, 'Professor Robert Vance', 'admin@campus.edu', 'admin123', 'ADMIN', 'Student Affairs & Dean Office', '🛡️')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Seed Clubs
INSERT INTO clubs (id, name, discipline, category, icon, description, members, coordinator) VALUES
(1, 'DEVS 💻', 'Technical', 'Technical', '💻', 'Premier Developer Student Community focusing on Web3, AI/ML hackathons, full-stack open source, and algorithmic problem solving.', 430, 'devs@campus.edu'),
(2, 'SEDS 🚀', 'Science', 'Science', '🚀', 'Students for the Exploration and Development of Space. Building sounding rockets, CubeSat payloads, and stargazing telescope sessions.', 285, 'seds@campus.edu'),
(3, 'Photography 📸', 'Cultural', 'Cultural', '📸', 'Capturing fleeting moments and college memoirs. Organizing scenic photowalks, Lightroom workshops, and campus exhibition galleries.', 310, 'shutterbugs@campus.edu'),
(4, 'Leo Club 🤝', 'Social', 'Social', '🤝', 'Youth leadership and community service organization committed to blood donation drives, orphanage support, and environmental conservation.', 510, 'leoclub@campus.edu'),
(5, 'Robotics 🤖', 'Technical', 'Technical', '🤖', 'Building battle bots, IoT sensor meshes, drones, and autonomous rovers for national robotics leagues and research symposiums.', 340, 'robotics@campus.edu'),
(6, 'Design & Media 🎨', 'Cultural', 'Cultural', '🎨', 'Crafting campus branding, UI/UX design systems, digital illustrations, and motion animations for all flagship festivals.', 220, 'design@campus.edu')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Club Activities
DELETE FROM club_activities;
INSERT INTO club_activities (club_id, activity) VALUES
(1, 'Hackathons'), (1, 'Tech Talks'), (1, 'Open Source Sprints'), (1, 'Code Reviews'),
(2, 'Rocketry'), (2, 'Astronomy Nights'), (2, 'Satellite Design'), (2, 'Space Seminars'),
(3, 'Photowalks'), (3, 'Visual Storytelling'), (3, 'Studio Lighting'), (3, 'Darkroom Tech'),
(4, 'Social Outreach'), (4, 'Blood Drives'), (4, 'Tree Plantation'), (4, 'Leadership Camps'),
(5, 'RoboWars'), (5, 'Drone Racing'), (5, 'PCB Design'), (5, 'ROS Workshops'),
(6, 'Figma Sprints'), (6, '3D Blender'), (6, 'Poster Design'), (6, 'Brand Guidelines');

-- Insert Seed Events
INSERT INTO events (id, title, category, date, time, venue, organizer_club, capacity, registered_count, banner_url, description) VALUES
(101, 'Campus HackFest 2026', 'Technology', '2026-10-18', '09:00 AM', 'Tech Auditorium Hall A', 'DEVS 💻', 200, 142, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', 'A 36-hour non-stop university hackathon bringing together programmers, designers, and innovators to solve real-world sustainability and campus life problems. Mentors from top tech giants, cash pool of $5,000, and free pizza guaranteed!'),
(102, 'StarGaze: Night Sky & Astrophotography', 'Space', '2026-10-22', '07:30 PM', 'Observatory Rooftop & Lawn', 'SEDS 🚀', 100, 78, 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80', 'Join SEDS for an enchanting night exploring Saturn''s rings, Jupiter''s moons, and deep space nebulae with computerized telescopes. Includes beginner-friendly astrophotography guidance.'),
(103, 'RoboCombat Grand Prix 2026', 'Robotics', '2026-10-28', '11:00 AM', 'Indoor Sports Arena', 'Robotics 🤖', 350, 290, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', 'Witness ferocious 15kg and 30kg combat robots battle in an armored cage equipped with flippers, spinning blades, and flame-throwers! Open to college teams across the state.'),
(104, 'Street Photography Walk: Old Town Vibes', 'Photography', '2026-11-02', '06:30 AM', 'Campus Main Gate (Departure point)', 'Photography 📸', 50, 42, 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80', 'Golden hour photowalk through heritage architecture and bustling market streets. Capture street portraits, candid moments, and architecture. All cameras & smartphones welcome.'),
(105, 'Blood Donation & Health Screening Camp', 'Social', '2026-11-07', '09:30 AM', 'Student Activity Center (SAC)', 'Leo Club 🤝', 250, 168, 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80', 'Annual campus blood donation drive in partnership with the Red Cross. Every donor receives refreshments, donor certificates, and free preliminary medical health checkups.'),
(106, 'UI/UX Design Sprint & Figma Masterclass', 'Workshop', '2026-11-12', '02:00 PM', 'Media Lab Room 302', 'Design & Media 🎨', 60, 55, 'https://images.unsplash.com/photo-1581291518655-9523843734a7?auto=format&fit=crop&w=800&q=80', 'Hands-on crash course on designing user flows, wireframes, and high-fidelity interactive prototypes in Figma. Attendees will build their portfolio case study in 3 hours.')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed Registrations
INSERT INTO registrations (id, event_id, user_id, student_name, student_email, student_department, ticket_code, registered_at) VALUES
(1, 101, 1, 'Alex Turner', 'alex@campus.edu', 'Computer Science & Engineering', 'CC-PASS-101-8841', '2026-10-10 14:32'),
(2, 103, 1, 'Alex Turner', 'alex@campus.edu', 'Computer Science & Engineering', 'CC-PASS-103-9124', '2026-10-11 11:15')
ON DUPLICATE KEY UPDATE student_name=VALUES(student_name);

-- Seed Announcements
INSERT INTO announcements (id, title, priority, content, author, created_at) VALUES
(1, 'Mid-Term Examination Schedule Released', 'HIGH', 'Mid-term examinations will commence from November 16. All club activities will remain suspended during exam hours. Download date sheet from portal.', 'Office of the Dean', '2026-10-12'),
(2, 'HackFest 2026 Team Registrations Open', 'MEDIUM', 'Teams of 2-4 students can now register for Campus HackFest. Hardware components will be provided by Robotics Club on a first-come basis.', 'DEVS & Robotics Club', '2026-10-10'),
(3, 'New Astronomical Telescope Installed', 'LOW', 'SEDS has commissioned a 12-inch Dobsonian telescope at the observatory. Public viewings are scheduled every clear Friday evening.', 'SEDS Observatory', '2026-10-08')
ON DUPLICATE KEY UPDATE title=VALUES(title);
