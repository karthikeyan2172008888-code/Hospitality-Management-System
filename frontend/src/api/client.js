// Centralized REST API Client for Hospitality Management System

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `HTTP ${response.status}: Request failed`;
      const validationDetails = data?.validationErrors
        ? Object.entries(data.validationErrors).map(([k, v]) => `${k}: ${v}`).join(', ')
        : null;
      throw new Error(validationDetails ? `${errorMsg} (${validationDetails})` : errorMsg);
    }

    return data?.data !== undefined ? data.data : data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    throw err;
  }
}

// 1. Hotel APIs
export const hotelApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.query) query.append('query', params.query);
    if (params.city) query.append('city', params.city);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/hotels${qs}`);
  },
  getById: (id) => request(`/hotels/${id}`),
  create: (hotelData) => request('/hotels', {
    method: 'POST',
    body: JSON.stringify(hotelData),
  }),
  update: (id, hotelData) => request(`/hotels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(hotelData),
  }),
  delete: (id) => request(`/hotels/${id}`, {
    method: 'DELETE',
  }),
};

// 2. Room APIs
export const roomApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.hotelId) query.append('hotelId', params.hotelId);
    if (params.roomType) query.append('roomType', params.roomType);
    if (params.status) query.append('status', params.status);
    if (params.roomNumber) query.append('roomNumber', params.roomNumber);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/rooms${qs}`);
  },
  getById: (id) => request(`/rooms/${id}`),
  getByHotel: (hotelId) => request(`/rooms/hotel/${hotelId}`),
  findAvailable: ({ hotelId, checkInDate, checkOutDate, guestCount, roomType }) => {
    const query = new URLSearchParams();
    if (hotelId) query.append('hotelId', hotelId);
    if (checkInDate) query.append('checkInDate', checkInDate);
    if (checkOutDate) query.append('checkOutDate', checkOutDate);
    if (guestCount) query.append('guestCount', guestCount);
    if (roomType) query.append('roomType', roomType);
    return request(`/rooms/available?${query.toString()}`);
  },
  create: (roomData) => request('/rooms', {
    method: 'POST',
    body: JSON.stringify(roomData),
  }),
  update: (id, roomData) => request(`/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roomData),
  }),
  delete: (id) => request(`/rooms/${id}`, {
    method: 'DELETE',
  }),
};

// 3. Guest APIs
export const guestApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.query) query.append('query', params.query);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/guests${qs}`);
  },
  getById: (id) => request(`/guests/${id}`),
  getReservations: (guestId) => request(`/guests/${guestId}/reservations`),
  register: (guestData) => request('/guests', {
    method: 'POST',
    body: JSON.stringify(guestData),
  }),
  update: (id, guestData) => request(`/guests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(guestData),
  }),
  delete: (id) => request(`/guests/${id}`, {
    method: 'DELETE',
  }),
};

// 4. Reservation APIs
export const reservationApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.hotelId) query.append('hotelId', params.hotelId);
    if (params.status) query.append('status', params.status);
    if (params.guestQuery) query.append('guestQuery', params.guestQuery);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/reservations${qs}`);
  },
  getById: (id) => request(`/reservations/${id}`),
  create: (reservationData) => request('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservationData),
  }),
  update: (id, reservationData) => request(`/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reservationData),
  }),
  updateStatus: (id, status) => request(`/reservations/${id}/status?status=${status}`, {
    method: 'PATCH',
  }),
  cancel: (id) => request(`/reservations/${id}/cancel`, {
    method: 'PATCH',
  }),
  delete: (id) => request(`/reservations/${id}`, {
    method: 'DELETE',
  }),
};

// 5. Payment APIs
export const paymentApi = {
  getAll: () => request('/payments'),
  getByReservation: (reservationId) => request(`/payments/reservation/${reservationId}`),
  record: (paymentData) => request('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
};

// 6. Dashboard & Analytics APIs
export const dashboardApi = {
  getSummary: () => request('/dashboard/summary'),
  getRecentReservations: () => request('/dashboard/recent-reservations'),
  getTrends: () => request('/dashboard/reservation-trends'),
  getOccupancyStats: () => request('/dashboard/occupancy-stats'),
};
