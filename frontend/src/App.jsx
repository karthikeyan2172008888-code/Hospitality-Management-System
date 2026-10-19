import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ToastContainer from './components/common/Toast';
import Dashboard from './pages/Dashboard';
import Hotels from './pages/Hotels';
import Rooms from './pages/Rooms';
import Guests from './pages/Guests';
import Reservations from './pages/Reservations';
import Payments from './pages/Payments';
import { Github, Linkedin, Instagram } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState([]);

  // Cross-page workflow states
  const [initialHotelIdForRooms, setInitialHotelIdForRooms] = useState(null);
  const [prefilledBooking, setPrefilledBooking] = useState(null);
  const [targetReservationForPayment, setTargetReservationForPayment] = useState(null);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cross-page navigation handlers
  const handleAddRoomForHotel = (hotelId) => {
    setInitialHotelIdForRooms(hotelId);
    setActiveTab('rooms');
  };

  const handleBookRoomFromAvailability = (bookingData) => {
    setPrefilledBooking(bookingData);
    setActiveTab('reservations');
  };

  const handleBookForGuest = (guestId) => {
    setPrefilledBooking({ guestId });
    setActiveTab('reservations');
  };

  const handleOpenPaymentForReservation = (reservation) => {
    setTargetReservationForPayment(reservation);
    setActiveTab('payments');
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main App Layout */}
      <div className="main-layout">
        <Navbar activeTab={activeTab} />

        <main style={{ flex: 1 }}>
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              openNewReservation={() => setActiveTab('reservations')}
              openNewHotel={() => setActiveTab('hotels')}
              openNewRoom={() => setActiveTab('rooms')}
              openNewGuest={() => setActiveTab('guests')}
              showToast={showToast}
            />
          )}

          {activeTab === 'hotels' && (
            <Hotels
              showToast={showToast}
              onAddRoomForHotel={handleAddRoomForHotel}
            />
          )}

          {activeTab === 'rooms' && (
            <Rooms
              showToast={showToast}
              initialHotelId={initialHotelIdForRooms}
              onBookRoom={handleBookRoomFromAvailability}
            />
          )}

          {activeTab === 'guests' && (
            <Guests
              showToast={showToast}
              onBookForGuest={handleBookForGuest}
            />
          )}

          {activeTab === 'reservations' && (
            <Reservations
              showToast={showToast}
              onOpenPayment={handleOpenPaymentForReservation}
              prefilledBooking={prefilledBooking}
              clearPrefilledBooking={() => setPrefilledBooking(null)}
            />
          )}

          {activeTab === 'payments' && (
            <Payments
              showToast={showToast}
              targetReservation={targetReservationForPayment}
              clearTargetReservation={() => setTargetReservationForPayment(null)}
            />
          )}
        </main>

        {/* Global Footer with Developer Credits */}
        <footer style={{
          padding: '16px 32px',
          borderTop: '1px solid var(--slate-200)',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.84rem',
          color: 'var(--slate-600)'
        }}>
          <div>
            <span>Hospitality Management System • Developed by </span>
            <strong style={{ color: 'var(--primary)' }}>KARTHIKEYAN M</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="https://github.com/karthikeyan2172008888-code"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--slate-800)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
            >
              <Github size={15} />
              <span>GitHub</span>
            </a>
            <span>•</span>
            <a
              href="https://www.linkedin.com/in/karthikeyan-m-2491b1429?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
            >
              <Linkedin size={15} />
              <span>LinkedIn</span>
            </a>
            <span>•</span>
            <a
              href="https://www.instagram.com/kxrthikeyyan?stkn=azdxb3U3YTh2MXM2"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#e11d48', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
            >
              <Instagram size={15} />
              <span>Instagram</span>
            </a>
          </div>
        </footer>
      </div>

      {/* Global Toast Stack */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
