import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  History,
  Eye,
  RefreshCw,
  BedDouble,
  Sparkles,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import { guestApi } from '../api/client';

export default function Guests({ showToast, onBookForGuest }) {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guestBookings, setGuestBookings] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: 'India',
    totalStays: 0,
  });

  // Stay Option: auto launch booking wizard after registration
  const [bookStayNow, setBookStayNow] = useState(false);

  const loadGuests = async () => {
    try {
      setLoading(true);
      const data = await guestApi.getAll({ query: searchQuery });
      setGuests(data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuests();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadGuests();
  };

  const handleOpenAdd = () => {
    setSelectedGuest(null);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      country: 'India',
      totalStays: 0,
    });
    setBookStayNow(false);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (guest) => {
    setSelectedGuest(guest);
    setFormData({
      fullName: guest.fullName,
      email: guest.email,
      phoneNumber: guest.phoneNumber,
      address: guest.address || '',
      city: guest.city || '',
      country: guest.country || 'India',
      totalStays: guest.totalStays ?? guest.totalReservations ?? 0,
    });
    setBookStayNow(false);
    setIsFormModalOpen(true);
  };

  const handleOpenDetail = (guest) => {
    setSelectedGuest(guest);
    setIsDetailModalOpen(true);
  };

  const handleOpenHistory = async (guest) => {
    setSelectedGuest(guest);
    setIsHistoryModalOpen(true);
    try {
      setLoadingHistory(true);
      const history = await guestApi.getReservations(guest.id);
      setGuestBookings(history || []);
    } catch (err) {
      showToast('Failed to load guest reservations: ' + err.message, 'error');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleOpenDelete = (guest) => {
    setSelectedGuest(guest);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedGuest) {
        await guestApi.update(selectedGuest.id, formData);
        showToast(`Guest '${formData.fullName}' updated successfully`, 'success');
        setIsFormModalOpen(false);
      } else {
        const newGuest = await guestApi.register(formData);
        showToast(`Guest '${formData.fullName}' registered successfully`, 'success');
        setIsFormModalOpen(false);

        // If user chose Stay Option: book stay immediately, launch wizard
        if (bookStayNow && onBookForGuest && newGuest?.id) {
          onBookForGuest(newGuest.id);
          return;
        }
      }
      loadGuests();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGuest) return;
    try {
      await guestApi.delete(selectedGuest.id);
      showToast(`Guest '${selectedGuest.fullName}' deleted successfully`, 'success');
      setIsDeleteModalOpen(false);
      loadGuests();
    } catch (err) {
      showToast(err.message, 'error');
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="content-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Guest Directory & Profiles</h2>
          <p>Register patrons, record stay histories, and manage guest relations</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary btn-sm" onClick={loadGuests} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
            <Plus size={15} />
            <span>Register New Guest</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="control-bar">
        <form onSubmit={handleSearchSubmit} className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search guests by full name, email, or mobile number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Guest Directory Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Guest ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Contact Phone</th>
                <th>Location</th>
                <th>Registration Date</th>
                <th>Total Stays</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                    Loading registered guests...
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                    No guests registered matching your search query.
                  </td>
                </tr>
              ) : (
                guests.map((g) => (
                  <tr key={g.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>#G-{g.id}</td>
                    <td style={{ fontWeight: 600 }}>{g.fullName}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={14} style={{ color: 'var(--slate-400)' }} />
                        <span>{g.email}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} style={{ color: 'var(--slate-400)' }} />
                        <span>{g.phoneNumber}</span>
                      </div>
                    </td>
                    <td>{g.city ? `${g.city}, ${g.country}` : g.country || '—'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      {g.registrationDate ? new Date(g.registrationDate).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: (g.totalStays ?? g.totalReservations ?? 0) > 0 ? '#eff6ff' : '#f8fafc',
                          color: (g.totalStays ?? g.totalReservations ?? 0) > 0 ? 'var(--primary)' : 'var(--slate-500)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          border: '1px solid var(--slate-200)',
                        }}
                      >
                        ⭐ {g.totalStays ?? g.totalReservations ?? 0} Stay{(g.totalStays ?? g.totalReservations) === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-icon-only" title="View Reservation History" onClick={() => handleOpenHistory(g)}>
                          <History size={16} />
                        </button>
                        <button className="btn-icon-only" title="Edit Profile" onClick={() => handleOpenEdit(g)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon-only" title="Delete Guest" onClick={() => handleOpenDelete(g)} style={{ color: 'var(--rose-500)' }}>
                          <Trash2 size={16} />
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

      {/* Register / Edit Guest Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedGuest ? `Edit Profile — ${selectedGuest.fullName}` : 'Register New Guest Profile'}
        size="md"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group col-span-2">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Aarav Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  required
                  className="form-control"
                  placeholder="e.g. aarav.sharma@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Phone Number <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. +91 98201 12345"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 42 Palm Avenue, Bandra West"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. India"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>

              {/* Total Number of Stays (Stay Option) */}
              <div className="form-group col-span-2">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} style={{ color: 'var(--amber-700)' }} />
                  <span>Stay Option: Total Number of Stays</span>
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 0 (or previous visits / loyalty stays)"
                  value={formData.totalStays}
                  onChange={(e) => setFormData({ ...formData, totalStays: Math.max(0, parseInt(e.target.value) || 0) })}
                />
                <span style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                  Records initial or historical stays/visit count for this guest in the system.
                </span>
              </div>

              {/* Quick Book Stay Option (For New Guests) */}
              {!selectedGuest && onBookForGuest && (
                <div
                  className="form-group col-span-2"
                  style={{
                    background: 'linear-gradient(135deg, #eff6ff, #f8fafc)',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #bfdbfe',
                    marginTop: '4px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={bookStayNow}
                      onChange={(e) => setBookStayNow(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                    />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BedDouble size={16} /> Book a stay immediately for this new guest
                    </span>
                  </label>
                  <p style={{ fontSize: '0.78rem', color: 'var(--slate-600)', marginTop: '4px', marginLeft: '28px' }}>
                    Automatically opens the Reservation Booking Wizard with this guest selected right after registering.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedGuest ? 'Save Changes' : (bookStayNow ? 'Register & Book Stay →' : 'Register Guest')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Guest Reservation History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={selectedGuest ? `Booking History — ${selectedGuest.fullName}` : 'Guest Bookings'}
        size="lg"
      >
        <div className="modal-body">
          {selectedGuest && (
            <div>
              <div
                style={{
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'var(--slate-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-200)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                    Email: <strong>{selectedGuest.email}</strong> • Phone: <strong>{selectedGuest.phoneNumber}</strong>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                    Total Stays Recorded: {selectedGuest.totalStays ?? selectedGuest.totalReservations ?? 0}
                  </div>
                </div>
                {onBookForGuest && (
                  <button
                    className="btn btn-sm btn-gold"
                    onClick={() => {
                      setIsHistoryModalOpen(false);
                      onBookForGuest(selectedGuest.id);
                    }}
                  >
                    <Plus size={14} /> Book New Stay for this Guest
                  </button>
                )}
              </div>

              {loadingHistory ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--slate-500)' }}>Loading reservations...</div>
              ) : guestBookings.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', color: 'var(--slate-500)' }}>
                  This guest has no recorded reservations in the database yet.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Res #</th>
                        <th>Hotel</th>
                        <th>Room</th>
                        <th>Dates</th>
                        <th>Cost</th>
                        <th>Paid</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guestBookings.map((b) => (
                        <tr key={b.id}>
                          <td style={{ fontWeight: 700 }}>#{b.id}</td>
                          <td>{b.hotelName}</td>
                          <td>Room {b.roomNumber}</td>
                          <td style={{ fontSize: '0.8rem' }}>{b.checkInDate} to {b.checkOutDate} ({b.numberOfNights}n)</td>
                          <td style={{ fontWeight: 700 }}>₹{Number(b.totalCost).toLocaleString()}</td>
                          <td>₹{Number(b.totalPaid || 0).toLocaleString()}</td>
                          <td><Badge status={b.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setIsHistoryModalOpen(false)}>
            Close
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Guest Profile"
        message={`Are you sure you want to delete '${selectedGuest?.fullName}'? Active reservations will block deletion.`}
        confirmText="Delete Guest"
        isDanger={true}
      />
    </div>
  );
}
