import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  CheckCircle,
  LogIn,
  LogOut,
  XCircle,
  CreditCard,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import { reservationApi, hotelApi, roomApi, guestApi } from '../api/client';

export default function Reservations({
  showToast,
  onOpenPayment,
  prefilledBooking,
  clearPrefilledBooking,
}) {
  const [reservations, setReservations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [hotelFilter, setHotelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [guestSearch, setGuestSearch] = useState('');

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedRes, setSelectedRes] = useState(null);

  // Booking Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardHotelId, setWizardHotelId] = useState('');
  const [wizardCheckIn, setWizardCheckIn] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [wizardCheckOut, setWizardCheckOut] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [wizardGuestCount, setWizardGuestCount] = useState(2);
  const [wizardRoomType, setWizardRoomType] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedGuestId, setSelectedGuestId] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [resData, hotelData, guestData] = await Promise.all([
        reservationApi.getAll({
          hotelId: hotelFilter || undefined,
          status: statusFilter || undefined,
          guestQuery: guestSearch || undefined,
        }),
        hotelApi.getAll(),
        guestApi.getAll(),
      ]);
      setReservations(resData || []);
      setHotels(hotelData || []);
      setGuests(guestData || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [hotelFilter, statusFilter]);

  // Handle prefilled booking request from other pages (e.g. from Rooms Availability modal or Guest profile)
  useEffect(() => {
    if (prefilledBooking) {
      setWizardHotelId(prefilledBooking.hotelId || '');
      if (prefilledBooking.checkInDate) setWizardCheckIn(prefilledBooking.checkInDate);
      if (prefilledBooking.checkOutDate) setWizardCheckOut(prefilledBooking.checkOutDate);
      if (prefilledBooking.numberOfGuests) setWizardGuestCount(prefilledBooking.numberOfGuests);
      if (prefilledBooking.guestId) setSelectedGuestId(prefilledBooking.guestId);
      setIsWizardOpen(true);
      setWizardStep(1);
      clearPrefilledBooking();
    }
  }, [prefilledBooking]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  // Booking Wizard Step 1 -> Find Available Rooms
  const handleSearchRoomsInWizard = async (e) => {
    e.preventDefault();
    try {
      setLoadingAvailable(true);
      const rooms = await roomApi.findAvailable({
        hotelId: wizardHotelId || undefined,
        checkInDate: wizardCheckIn,
        checkOutDate: wizardCheckOut,
        guestCount: wizardGuestCount,
        roomType: wizardRoomType || undefined,
      });
      setAvailableRooms(rooms || []);
      setWizardStep(2);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingAvailable(false);
    }
  };

  // Booking Wizard Step 2 -> Select Room and Proceed to Guest Selection
  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setWizardStep(3);
  };

  // Booking Wizard Calculation
  const calculateStaySummary = () => {
    if (!wizardCheckIn || !wizardCheckOut || !selectedRoom) return { nights: 0, total: 0 };
    const inDate = new Date(wizardCheckIn);
    const outDate = new Date(wizardCheckOut);
    const diffTime = outDate - inDate;
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const total = nights * Number(selectedRoom.pricePerNight);
    return { nights, total };
  };

  // Booking Wizard Step 3 -> Final Confirmation
  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    if (!selectedGuestId || !selectedRoom) {
      showToast('Please select guest and room', 'error');
      return;
    }

    try {
      await reservationApi.create({
        guestId: Number(selectedGuestId),
        hotelId: selectedRoom.hotelId,
        roomId: selectedRoom.id,
        checkInDate: wizardCheckIn,
        checkOutDate: wizardCheckOut,
        numberOfGuests: wizardGuestCount,
        specialRequests: specialRequests,
      });
      showToast('Reservation confirmed and booked successfully!', 'success');
      setIsWizardOpen(false);
      resetWizard();
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const resetWizard = () => {
    setWizardStep(1);
    setSelectedRoom(null);
    setSelectedGuestId('');
    setSpecialRequests('');
    setAvailableRooms([]);
  };

  // Status transitions
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await reservationApi.updateStatus(id, newStatus);
      showToast(`Reservation #${id} status updated to ${newStatus}`, 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCancelConfirm = async () => {
    if (!selectedRes) return;
    try {
      await reservationApi.cancel(selectedRes.id);
      showToast(`Reservation #${selectedRes.id} cancelled. Room availability released.`, 'success');
      setIsCancelModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
      setIsCancelModalOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRes) return;
    try {
      await reservationApi.delete(selectedRes.id);
      showToast(`Reservation #${selectedRes.id} deleted.`, 'success');
      setIsDeleteModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
      setIsDeleteModalOpen(false);
    }
  };

  const { nights, total } = calculateStaySummary();

  return (
    <div className="content-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Reservation & Booking Operations</h2>
          <p>Execute live room availability lookups, manage guest check-ins, balances, and cancellations</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary btn-sm" onClick={loadData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            className="btn btn-gold btn-sm"
            onClick={() => {
              resetWizard();
              setIsWizardOpen(true);
            }}
          >
            <Plus size={15} />
            <span>New Reservation Wizard</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="control-bar">
        <form onSubmit={handleSearchSubmit} className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by guest name or email..."
            value={guestSearch}
            onChange={(e) => setGuestSearch(e.target.value)}
          />
        </form>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            className="filter-select"
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value)}
          >
            <option value="">All Hotels</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="CHECKED_OUT">Checked Out</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Guest Profile</th>
                <th>Hotel Property</th>
                <th>Room #</th>
                <th>Stay Dates</th>
                <th>Total Cost</th>
                <th>Paid</th>
                <th>Balance Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                    Loading reservations...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                    No reservations found matching the filters.
                  </td>
                </tr>
              ) : (
                reservations.map((res) => (
                  <tr key={res.id}>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>#{res.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{res.guestName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{res.guestPhone}</div>
                    </td>
                    <td>{res.hotelName}</td>
                    <td>
                      <span style={{ fontWeight: 700 }}>Room {res.roomNumber}</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{res.roomType}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{res.checkInDate} → {res.checkOutDate}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{res.numberOfNights} Nights • {res.numberOfGuests} Guests</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>₹{Number(res.totalCost).toLocaleString()}</td>
                    <td style={{ color: 'var(--emerald-700)', fontWeight: 600 }}>
                      ₹{Number(res.totalPaid || 0).toLocaleString()}
                    </td>
                    <td>
                      {Number(res.remainingBalance || 0) > 0 ? (
                        <span style={{ color: 'var(--rose-700)', fontWeight: 700 }}>
                          ₹{Number(res.remainingBalance).toLocaleString()}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--emerald-700)', fontWeight: 600 }}>Settled</span>
                      )}
                    </td>
                    <td>
                      <Badge status={res.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {/* Check-In */}
                        {res.status === 'CONFIRMED' && (
                          <button
                            className="btn btn-sm btn-secondary"
                            title="Check-In Guest"
                            onClick={() => handleStatusUpdate(res.id, 'CHECKED_IN')}
                          >
                            <LogIn size={14} /> Check-In
                          </button>
                        )}

                        {/* Check-Out */}
                        {res.status === 'CHECKED_IN' && (
                          <button
                            className="btn btn-sm btn-secondary"
                            title="Check-Out Guest"
                            onClick={() => handleStatusUpdate(res.id, 'CHECKED_OUT')}
                          >
                            <LogOut size={14} /> Check-Out
                          </button>
                        )}

                        {/* Record Payment */}
                        {onOpenPayment && (
                          <button
                            className="btn btn-sm btn-secondary"
                            title="Record Payment"
                            onClick={() => onOpenPayment(res)}
                          >
                            <CreditCard size={14} /> Pay
                          </button>
                        )}

                        {/* Cancel */}
                        {(res.status === 'CONFIRMED' || res.status === 'CHECKED_IN') && (
                          <button
                            className="btn btn-icon-only"
                            title="Cancel Reservation"
                            onClick={() => {
                              setSelectedRes(res);
                              setIsCancelModalOpen(true);
                            }}
                            style={{ color: 'var(--amber-700)' }}
                          >
                            <XCircle size={16} />
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          className="btn btn-icon-only"
                          title="View Details"
                          onClick={() => {
                            setSelectedRes(res);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Booking Wizard Modal */}
      <Modal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        title={`New Reservation Booking Wizard — Step ${wizardStep} of 3`}
        size="lg"
      >
        <div className="modal-body">
          {/* Step 1: Destination & Date Selection */}
          {wizardStep === 1 && (
            <form onSubmit={handleSearchRoomsInWizard}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
                Step 1: Select Stay Dates, Property & Guests
              </h4>

              <div className="form-grid">
                <div className="form-group col-span-2">
                  <label className="form-label">Hotel Property <span className="required">*</span></label>
                  <select
                    required
                    className="form-control"
                    value={wizardHotelId}
                    onChange={(e) => setWizardHotelId(e.target.value)}
                  >
                    <option value="">Select Target Hotel Property...</option>
                    {hotels.map((h) => (
                      <option key={h.id} value={h.id}>{h.name} — {h.city}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Check-In Date <span className="required">*</span></label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={wizardCheckIn}
                    onChange={(e) => setWizardCheckIn(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Check-Out Date <span className="required">*</span></label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={wizardCheckOut}
                    onChange={(e) => setWizardCheckOut(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Number of Guests <span className="required">*</span></label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    className="form-control"
                    value={wizardGuestCount}
                    onChange={(e) => setWizardGuestCount(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Room Category Filter (Optional)</label>
                  <select
                    className="form-control"
                    value={wizardRoomType}
                    onChange={(e) => setWizardRoomType(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="STANDARD">Standard</option>
                    <option value="DELUXE">Deluxe</option>
                    <option value="SUITE">Suite</option>
                    <option value="FAMILY">Family</option>
                    <option value="EXECUTIVE">Executive</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsWizardOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loadingAvailable}>
                  <Sparkles size={15} />
                  <span>{loadingAvailable ? 'Checking Availability...' : 'Find Available Rooms →'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Available Rooms Selection */}
          {wizardStep === 2 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                  Step 2: Available Rooms for {wizardCheckIn} to {wizardCheckOut}
                </h4>
                <button className="btn btn-sm btn-secondary" onClick={() => setWizardStep(1)}>
                  ← Modify Dates
                </button>
              </div>

              {availableRooms.length === 0 ? (
                <div style={{ padding: '36px', textAlign: 'center', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ color: 'var(--rose-700)', fontWeight: 600 }}>No available rooms found for the selected dates and hotel.</p>
                  <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginTop: '6px' }}>
                    All rooms may be booked, under maintenance, or exceed capacity. Please select alternate dates.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Room #</th>
                        <th>Category</th>
                        <th>Floor</th>
                        <th>Capacity</th>
                        <th>Nightly Rate</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableRooms.map((rm) => (
                        <tr key={rm.id}>
                          <td style={{ fontWeight: 800 }}>Room {rm.roomNumber}</td>
                          <td>{rm.roomType}</td>
                          <td>Floor {rm.floorNumber}</td>
                          <td>Up to {rm.maxCapacity}</td>
                          <td style={{ fontWeight: 700 }}>₹{Number(rm.pricePerNight).toLocaleString()}</td>
                          <td>
                            <button className="btn btn-sm btn-gold" onClick={() => handleSelectRoom(rm)}>
                              Select Room →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Guest Selection & Booking Confirmation */}
          {wizardStep === 3 && selectedRoom && (
            <form onSubmit={handleConfirmReservation}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                  Step 3: Assign Guest & Review Booking
                </h4>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setWizardStep(2)}>
                  ← Change Room
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group col-span-2">
                  <label className="form-label">Select Registered Guest <span className="required">*</span></label>
                  <select
                    required
                    className="form-control"
                    value={selectedGuestId}
                    onChange={(e) => setSelectedGuestId(e.target.value)}
                  >
                    <option value="">Choose guest from directory...</option>
                    {guests.map((g) => (
                      <option key={g.id} value={g.id}>{g.fullName} ({g.email} • {g.phoneNumber})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group col-span-2">
                  <label className="form-label">Special Requests / Preferences</label>
                  <textarea
                    className="form-control"
                    placeholder="e.g. Quiet room, late arrival at 9 PM, baby cot, vegetarian breakfast..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
              </div>

              {/* Automatic Cost Breakdown Box */}
              <div className="cost-breakdown-card">
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px', color: 'var(--slate-800)' }}>
                  Reservation Cost & Stay Summary
                </div>
                <div className="breakdown-row">
                  <span>Selected Room:</span>
                  <span>Room {selectedRoom.roomNumber} ({selectedRoom.roomType}) • {selectedRoom.hotelName}</span>
                </div>
                <div className="breakdown-row">
                  <span>Stay Window:</span>
                  <span>{wizardCheckIn} to {wizardCheckOut}</span>
                </div>
                <div className="breakdown-row">
                  <span>Nightly Rate:</span>
                  <span>₹{Number(selectedRoom.pricePerNight).toLocaleString()}</span>
                </div>
                <div className="breakdown-row">
                  <span>Number of Nights:</span>
                  <span>{nights} Night{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="breakdown-row total">
                  <span>Total Booking Cost:</span>
                  <span>₹{Number(total).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsWizardOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={15} /> Confirm & Book Reservation
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Reservation Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedRes ? `Booking Details — #${selectedRes.id}` : 'Reservation'}
        size="md"
      >
        <div className="modal-body">
          {selectedRes && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Total: ₹{Number(selectedRes.totalCost).toLocaleString()}</span>
                <Badge status={selectedRes.status} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.85rem', marginBottom: '16px' }}>
                <div><strong>Guest:</strong> {selectedRes.guestName}</div>
                <div><strong>Contact:</strong> {selectedRes.guestPhone}</div>
                <div><strong>Hotel:</strong> {selectedRes.hotelName}</div>
                <div><strong>Room:</strong> Room {selectedRes.roomNumber} ({selectedRes.roomType})</div>
                <div><strong>Check-In:</strong> {selectedRes.checkInDate}</div>
                <div><strong>Check-Out:</strong> {selectedRes.checkOutDate}</div>
                <div><strong>Nights:</strong> {selectedRes.numberOfNights}</div>
                <div><strong>Guests:</strong> {selectedRes.numberOfGuests}</div>
              </div>

              <div style={{ background: 'var(--slate-50)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Total Amount Paid:</span>
                  <span style={{ fontWeight: 700, color: 'var(--emerald-700)' }}>₹{Number(selectedRes.totalPaid || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Outstanding Balance:</span>
                  <span style={{ fontWeight: 700, color: Number(selectedRes.remainingBalance || 0) > 0 ? 'var(--rose-700)' : 'var(--emerald-700)' }}>
                    ₹{Number(selectedRes.remainingBalance || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedRes.specialRequests && (
                <div style={{ marginTop: '14px', fontSize: '0.85rem' }}>
                  <strong>Special Requests:</strong>
                  <p style={{ color: 'var(--slate-600)', marginTop: '4px' }}>{selectedRes.specialRequests}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
            Close
          </button>
        </div>
      </Modal>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Reservation"
        message={`Are you sure you want to cancel Reservation #${selectedRes?.id} for ${selectedRes?.guestName}? Room ${selectedRes?.roomNumber} will become immediately available for other guests.`}
        confirmText="Cancel Reservation"
        isDanger={false}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Reservation Record"
        message={`Are you sure you want to permanently delete Reservation #${selectedRes?.id}? This cannot be undone.`}
        confirmText="Delete Record"
        isDanger={true}
      />
    </div>
  );
}
