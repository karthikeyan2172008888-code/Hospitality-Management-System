import React, { useState, useEffect } from 'react';
import { Hotel, Bell, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab }) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pageTitles = {
    dashboard: 'Executive Dashboard & Overview',
    hotels: 'Hotel Properties Directory',
    rooms: 'Room Inventory & Live Availability',
    guests: 'Guest Management & Profiles',
    reservations: 'Reservations & Booking Engine',
    payments: 'Billing & Transaction Ledger',
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <span className="page-title-badge">
          {pageTitles[activeTab] || 'Hospitality Management'}
        </span>
      </div>

      <div className="navbar-right">
        <div className="system-status">
          <span className="status-dot"></span>
          <span>Localhost Spring Boot 3.3 Connected</span>
        </div>

        <div className="quick-date">
          <span>{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {currentTime}</span>
        </div>
      </div>
    </header>
  );
}
