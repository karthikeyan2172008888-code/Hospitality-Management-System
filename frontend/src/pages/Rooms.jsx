import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  Plus,
  Search,
  Calendar,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import { roomApi, hotelApi } from '../api/client';

export default function Rooms({ showToast, initialHotelId, onBookRoom }) {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [hotelFilter, setHotelFilter] = useState(initialHotelId || '');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roomNumberSearch, setRoomNumberSearch] = useState('');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    hotelId: '',
    roomNumber: '',
    roomType: 'STANDARD',
    floorNumber: 1,
    maxCapacity: 2,
    pricePerNight: 4500,
    status: 'AVAILABLE',
    description: '',
    amenities: 'Queen Bed, AC, High-Speed WiFi, Smart TV',
  });

  // Availability Checker State
  const [availQuery, setAvailQuery] = useState({
    hotelId: '',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    guestCount: 2,
    roomType: '',
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [hasSearchedAvail, setHasSearchedAvail] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, hotelsData] = await Promise.all([
        roomApi.getAll({
          hotelId: hotelFilter || undefined,
          roomType: typeFilter || undefined,
          status: statusFilter || undefined,
          roomNumber: roomNumberSearch || undefined,
        }),
        hotelApi.getAll(),
      ]);
      setRooms(roomsData || []);
      setHotels(hotelsData || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [hotelFilter, typeFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenAdd = () => {
    setSelectedRoom(null);
    setFormData({
      hotelId: hotels[0]?.id || '',
      roomNumber: '',
      roomType: 'STANDARD',
      floorNumber: 1,
      maxCapacity: 2,
      pricePerNight: 4500,
      status: 'AVAILABLE',
      description: 'Comfortable air-conditioned hotel room with premium bedding.',
      amenities: 'Queen Bed, AC, High-Speed WiFi, Smart TV, Tea Maker',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setSelectedRoom(room);
    setFormData({
      hotelId: room.hotelId,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      floorNumber: room.floorNumber,
      maxCapacity: room.maxCapacity,
      pricePerNight: room.pricePerNight,
      status: room.status,
      description: room.description || '',
      amenities: room.amenities || '',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenDetail = (room) => {
    setSelectedRoom(room);
    setIsDetailModalOpen(true);
  };

  const handleOpenDelete = (room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRoom) {
        await roomApi.update(selectedRoom.id, formData);
        showToast(`Room ${formData.roomNumber} updated successfully`, 'success');
      } else {
        await roomApi.create(formData);
        showToast(`Room ${formData.roomNumber} created successfully`, 'success');
      }
      setIsFormModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRoom) return;
    try {
      await roomApi.delete(selectedRoom.id);
      showToast(`Room ${selectedRoom.roomNumber} deleted successfully`, 'success');
      setIsDeleteModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
      setIsDeleteModalOpen(false);
    }
  };

  const handleCheckAvailability = async (e) => {
    if (e) e.preventDefault();
    try {
      setCheckingAvailability(true);
      const results = await roomApi.findAvailable({
        hotelId: availQuery.hotelId || undefined,
        checkInDate: availQuery.checkInDate,
        checkOutDate: availQuery.checkOutDate,
        guestCount: availQuery.guestCount || undefined,
        roomType: availQuery.roomType || undefined,
      });
      setAvailableRooms(results || []);
      setHasSearchedAvail(true);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCheckingAvailability(false);
    }
  };

  return (
    <div className="content-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Room Inventory & Availability</h2>
          <p>Configure room rates, categories, maintenance schedules, and query real-time availability</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-gold btn-sm"
            onClick={() => {
              setIsAvailabilityModalOpen(true);
              setHasSearchedAvail(false);
              setAvailableRooms([]);
            }}
          >
            <Sparkles size={15} />
            <span>Check Availability Engine</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={loadData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
            <Plus size={15} />
            <span>Add New Room</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="control-bar">
        <form onSubmit={handleSearchSubmit} className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by room number..."
            value={roomNumberSearch}
            onChange={(e) => setRoomNumberSearch(e.target.value)}
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Room Types</option>
            <option value="STANDARD">Standard</option>
            <option value="DELUXE">Deluxe</option>
            <option value="SUITE">Suite</option>
            <option value="FAMILY">Family</option>
            <option value="EXECUTIVE">Executive</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
        </div>
      </div>

      {/* Room Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Room #</th>
                <th>Hotel Property</th>
                <th>Room Category</th>
                <th>Floor</th>
                <th>Capacity</th>
                <th>Nightly Rate</th>
                <th>Current Status</th>
                <th>Amenities Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                    Loading rooms inventory...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                    No rooms found matching the selected filters.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id}>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>Room {room.roomNumber}</td>
                    <td style={{ fontWeight: 600 }}>{room.hotelName}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--slate-700)' }}>{room.roomType}</span>
                    </td>
                    <td>Floor {room.floorNumber}</td>
                    <td>{room.maxCapacity} Guests</td>
                    <td style={{ fontWeight: 700 }}>₹{Number(room.pricePerNight).toLocaleString()}</td>
                    <td>
                      <Badge status={room.status} />
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--slate-500)', maxWidth: '200px' }}>
                      {room.amenities ? room.amenities.split(',').slice(0, 2).join(', ') : 'Standard'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-icon-only" title="View Room Details" onClick={() => handleOpenDetail(room)}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon-only" title="Edit Room" onClick={() => handleOpenEdit(room)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon-only" title="Delete Room" onClick={() => handleOpenDelete(room)} style={{ color: 'var(--rose-500)' }}>
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

      {/* Add / Edit Room Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedRoom ? `Edit Room ${selectedRoom.roomNumber}` : 'Add Room to Hotel'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group col-span-2">
                <label className="form-label">Hotel Property <span className="required">*</span></label>
                <select
                  required
                  className="form-control"
                  value={formData.hotelId}
                  onChange={(e) => setFormData({ ...formData, hotelId: Number(e.target.value) })}
                >
                  <option value="">Select Hotel...</option>
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Room Number <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. 101, F-12, Penthouse-1"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Room Type <span className="required">*</span></label>
                <select
                  required
                  className="form-control"
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                >
                  <option value="STANDARD">Standard</option>
                  <option value="DELUXE">Deluxe</option>
                  <option value="SUITE">Suite</option>
                  <option value="FAMILY">Family</option>
                  <option value="EXECUTIVE">Executive</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Floor Number <span className="required">*</span></label>
                <input
                  type="number"
                  min="0"
                  required
                  className="form-control"
                  value={formData.floorNumber}
                  onChange={(e) => setFormData({ ...formData, floorNumber: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Guest Capacity <span className="required">*</span></label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  className="form-control"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price Per Night (₹) <span className="required">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  className="form-control"
                  value={formData.pricePerNight}
                  onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Room Status <span className="required">*</span></label>
                <select
                  required
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Room Amenities (Comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. King Bed, Balcony, Sea View, Mini Fridge, Jacuzzi"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Special room features, view descriptions, bed sizes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedRoom ? 'Save Changes' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Room Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedRoom ? `Room ${selectedRoom.roomNumber} — ${selectedRoom.hotelName}` : 'Room Details'}
        size="md"
      >
        <div className="modal-body">
          {selectedRoom && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{Number(selectedRoom.pricePerNight).toLocaleString()} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--slate-500)' }}>/ night</span></span>
                <Badge status={selectedRoom.status} />
              </div>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '16px' }}>
                {selectedRoom.description}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.85rem' }}>
                <div><strong>Hotel:</strong> {selectedRoom.hotelName}</div>
                <div><strong>Category:</strong> {selectedRoom.roomType}</div>
                <div><strong>Floor:</strong> Floor {selectedRoom.floorNumber}</div>
                <div><strong>Capacity:</strong> Up to {selectedRoom.maxCapacity} Guests</div>
              </div>
              <div style={{ marginTop: '16px', borderTop: '1px solid var(--slate-200)', paddingTop: '12px' }}>
                <strong style={{ fontSize: '0.85rem' }}>Room Amenities:</strong>
                <div className="amenities-chips" style={{ marginTop: '6px' }}>
                  {selectedRoom.amenities ? selectedRoom.amenities.split(',').map((a, i) => (
                    <span key={i} className="amenity-chip">{a.trim()}</span>
                  )) : 'Standard Hotel Amenities'}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
            Close
          </button>
        </div>
      </Modal>

      {/* Real-time Room Availability Search Modal */}
      <Modal
        isOpen={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
        title="Real-Time Room Availability Search Engine"
        size="lg"
      >
        <div className="modal-body">
          <form onSubmit={handleCheckAvailability}>
            <div className="form-grid" style={{ marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Check-In Date</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={availQuery.checkInDate}
                  onChange={(e) => setAvailQuery({ ...availQuery, checkInDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Check-Out Date</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={availQuery.checkOutDate}
                  onChange={(e) => setAvailQuery({ ...availQuery, checkOutDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hotel (Optional)</label>
                <select
                  className="form-control"
                  value={availQuery.hotelId}
                  onChange={(e) => setAvailQuery({ ...availQuery, hotelId: e.target.value })}
                >
                  <option value="">All Hotels</option>
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Guests Count</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="form-control"
                  value={availQuery.guestCount}
                  onChange={(e) => setAvailQuery({ ...availQuery, guestCount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button type="submit" className="btn btn-primary" disabled={checkingAvailability}>
                <Search size={15} />
                <span>{checkingAvailability ? 'Checking Availability...' : 'Search Available Rooms'}</span>
              </button>
            </div>
          </form>

          {/* Results Display */}
          {hasSearchedAvail && (
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
                Available Rooms for {availQuery.checkInDate} to {availQuery.checkOutDate} ({availableRooms.length})
              </h4>
              {availableRooms.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', color: 'var(--slate-500)' }}>
                  No available rooms match these dates and criteria. Try alternative dates or property.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Room #</th>
                        <th>Hotel</th>
                        <th>Category</th>
                        <th>Capacity</th>
                        <th>Price/Night</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableRooms.map((r) => (
                        <tr key={r.id}>
                          <td style={{ fontWeight: 800 }}>Room {r.roomNumber}</td>
                          <td>{r.hotelName}</td>
                          <td>{r.roomType}</td>
                          <td>Up to {r.maxCapacity}</td>
                          <td style={{ fontWeight: 700 }}>₹{Number(r.pricePerNight).toLocaleString()}</td>
                          <td>
                            {onBookRoom && (
                              <button
                                className="btn btn-sm btn-gold"
                                onClick={() => {
                                  setIsAvailabilityModalOpen(false);
                                  onBookRoom({
                                    hotelId: r.hotelId,
                                    roomId: r.id,
                                    checkInDate: availQuery.checkInDate,
                                    checkOutDate: availQuery.checkOutDate,
                                    numberOfGuests: availQuery.guestCount,
                                  });
                                }}
                              >
                                Book This Room
                              </button>
                            )}
                          </td>
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
          <button className="btn btn-secondary" onClick={() => setIsAvailabilityModalOpen(false)}>
            Close
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Room Record"
        message={`Are you sure you want to delete Room '${selectedRoom?.roomNumber}' from '${selectedRoom?.hotelName}'? This will fail if there are active bookings.`}
        confirmText="Delete Room"
        isDanger={true}
      />
    </div>
  );
}
