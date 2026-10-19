import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Eye,
  BedDouble,
  RefreshCw,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import { hotelApi, roomApi } from '../api/client';

export default function Hotels({ showToast, onAddRoomForHotel }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelRooms, setHotelRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    contactNumber: '',
    email: '',
    description: '',
    amenities: '',
  });

  const loadHotels = async () => {
    try {
      setLoading(true);
      const data = await hotelApi.getAll({ query: searchQuery, city: cityFilter });
      setHotels(data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, [cityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadHotels();
  };

  const handleOpenAdd = () => {
    setSelectedHotel(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      contactNumber: '',
      email: '',
      description: '',
      amenities: 'Free WiFi, Swimming Pool, Spa, Gym, Restaurant, Parking',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (hotel) => {
    setSelectedHotel(hotel);
    setFormData({
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
      state: hotel.state,
      country: hotel.country,
      contactNumber: hotel.contactNumber,
      email: hotel.email,
      description: hotel.description || '',
      amenities: hotel.amenities || '',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenDetail = async (hotel) => {
    setSelectedHotel(hotel);
    setIsDetailModalOpen(true);
    try {
      setLoadingRooms(true);
      const rooms = await roomApi.getByHotel(hotel.id);
      setHotelRooms(rooms || []);
    } catch (err) {
      showToast('Failed to load hotel rooms: ' + err.message, 'error');
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleOpenDelete = (hotel) => {
    setSelectedHotel(hotel);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedHotel) {
        await hotelApi.update(selectedHotel.id, formData);
        showToast(`Hotel '${formData.name}' updated successfully`, 'success');
      } else {
        await hotelApi.create(formData);
        showToast(`Hotel '${formData.name}' added successfully`, 'success');
      }
      setIsFormModalOpen(false);
      loadHotels();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedHotel) return;
    try {
      await hotelApi.delete(selectedHotel.id);
      showToast(`Hotel '${selectedHotel.name}' deleted successfully`, 'success');
      setIsDeleteModalOpen(false);
      loadHotels();
    } catch (err) {
      showToast(err.message, 'error');
      setIsDeleteModalOpen(false);
    }
  };

  const cities = Array.from(new Set(hotels.map((h) => h.city))).filter(Boolean);

  return (
    <div className="content-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Hotel Property Management</h2>
          <p>Register, update, and manage luxury and boutique hotel branches</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary btn-sm" onClick={loadHotels} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
            <Plus size={15} />
            <span>Add Hotel Property</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="control-bar">
        <form onSubmit={handleSearchSubmit} className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search hotel by property name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            className="filter-select"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All Locations / Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--slate-500)' }}>
          Loading hotel properties...
        </div>
      ) : hotels.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)' }}>
          <Building2 size={40} style={{ color: 'var(--slate-400)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No hotels match your search</h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.88rem', marginTop: '4px' }}>Try adjusting your search criteria or register a new hotel.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-card-header">
                <div className="hotel-card-title">{hotel.name}</div>
                <div className="hotel-card-location">
                  <MapPin size={14} />
                  <span>{hotel.city}, {hotel.state}, {hotel.country}</span>
                </div>
              </div>

              <div className="hotel-card-body">
                <p className="hotel-card-desc">{hotel.description || 'Premium hospitality destination.'}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} style={{ color: 'var(--slate-400)' }} />
                    <span>{hotel.contactNumber}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} style={{ color: 'var(--slate-400)' }} />
                    <span>{hotel.email}</span>
                  </div>
                </div>

                {hotel.amenities && (
                  <div className="amenities-chips">
                    {hotel.amenities.split(',').slice(0, 4).map((amenity, idx) => (
                      <span key={idx} className="amenity-chip">{amenity.trim()}</span>
                    ))}
                    {hotel.amenities.split(',').length > 4 && (
                      <span className="amenity-chip">+{hotel.amenities.split(',').length - 4} more</span>
                    )}
                  </div>
                )}
              </div>

              <div className="hotel-card-footer">
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)' }}>
                  {hotel.totalRooms} Room{hotel.totalRooms === 1 ? '' : 's'} Configured
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn-icon-only" title="View Details & Rooms" onClick={() => handleOpenDetail(hotel)}>
                    <Eye size={16} />
                  </button>
                  <button className="btn-icon-only" title="Edit Hotel" onClick={() => handleOpenEdit(hotel)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-icon-only" title="Delete Hotel" onClick={() => handleOpenDelete(hotel)} style={{ color: 'var(--rose-500)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Hotel Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedHotel ? 'Edit Hotel Property' : 'Register New Hotel Property'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group col-span-2">
                <label className="form-label">Hotel Name <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Grand Horizon Palace"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Street Address <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. 124 Marine Drive"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State / Province <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. India"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Number <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. +91 22 2845 9000"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Official Email <span className="required">*</span></label>
                <input
                  type="email"
                  required
                  className="form-control"
                  placeholder="e.g. reservations@grandhorizon.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Amenities (Comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Free WiFi, Swimming Pool, Spa, Gym, Restaurant, Free Parking"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Detailed overview of the property, views, and specialty services..."
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
              {selectedHotel ? 'Save Changes' : 'Create Hotel'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Hotel Detail Modal (shows info + associated rooms) */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedHotel ? `${selectedHotel.name} — Property Details` : 'Hotel Details'}
        size="lg"
      >
        <div className="modal-body">
          {selectedHotel && (
            <div>
              <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--slate-200)' }}>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '12px' }}>
                  {selectedHotel.description}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
                  <div><strong>Address:</strong> {selectedHotel.address}, {selectedHotel.city}</div>
                  <div><strong>Contact:</strong> {selectedHotel.contactNumber}</div>
                  <div><strong>Email:</strong> {selectedHotel.email}</div>
                  <div><strong>State/Country:</strong> {selectedHotel.state}, {selectedHotel.country}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Associated Rooms ({hotelRooms.length})</h4>
                {onAddRoomForHotel && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      onAddRoomForHotel(selectedHotel.id);
                    }}
                  >
                    <Plus size={14} /> Add Room to this Hotel
                  </button>
                )}
              </div>

              {loadingRooms ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--slate-500)' }}>Loading rooms...</div>
              ) : hotelRooms.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--slate-500)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  No rooms created for this hotel yet.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Room #</th>
                        <th>Type</th>
                        <th>Floor</th>
                        <th>Max Guests</th>
                        <th>Price / Night</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotelRooms.map((rm) => (
                        <tr key={rm.id}>
                          <td style={{ fontWeight: 700 }}>Room {rm.roomNumber}</td>
                          <td>{rm.roomType}</td>
                          <td>Floor {rm.floorNumber}</td>
                          <td>{rm.maxCapacity} Guests</td>
                          <td style={{ fontWeight: 700 }}>₹{Number(rm.pricePerNight).toLocaleString()}</td>
                          <td><Badge status={rm.status} /></td>
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
          <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
            Close
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Hotel Property"
        message={`Are you sure you want to delete '${selectedHotel?.name}'? This action cannot be undone. If the hotel contains rooms or active reservations, the system will prevent deletion.`}
        confirmText="Delete Hotel"
        isDanger={true}
      />
    </div>
  );
}
