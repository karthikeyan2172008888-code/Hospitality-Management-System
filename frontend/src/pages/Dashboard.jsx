import React, { useState, useEffect } from 'react';
import {
  Building2,
  BedDouble,
  CheckCircle2,
  UserCheck,
  Users,
  CalendarCheck,
  LogIn,
  IndianRupee,
  PlusCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import StatsCard from '../components/common/StatsCard';
import Badge from '../components/common/Badge';
import { dashboardApi, reservationApi } from '../api/client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard({ setActiveTab, openNewReservation, openNewHotel, openNewRoom, openNewGuest, showToast }) {
  const [summary, setSummary] = useState(null);
  const [recentReservations, setRecentReservations] = useState([]);
  const [trends, setTrends] = useState([]);
  const [occupancy, setOccupancy] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [sumData, recentData, trendData, occData] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getRecentReservations(),
        dashboardApi.getTrends(),
        dashboardApi.getOccupancyStats(),
      ]);
      setSummary(sumData);
      setRecentReservations(recentData || []);
      setTrends(trendData || []);
      setOccupancy(occData || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleQuickStatusUpdate = async (id, newStatus) => {
    try {
      await reservationApi.updateStatus(id, newStatus);
      showToast(`Reservation #${id} status updated to ${newStatus}`, 'success');
      loadDashboardData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Trends Chart Data
  const trendLabels = trends.map((t) => t.label);
  const trendCounts = trends.map((t) => t.count);
  const trendRevenue = trends.map((t) => t.revenue);

  const trendChartData = {
    labels: trendLabels.length ? trendLabels : ['Current'],
    datasets: [
      {
        label: 'Reservations Count',
        data: trendCounts.length ? trendCounts : [0],
        borderColor: '#1e3a8a',
        backgroundColor: 'rgba(30, 58, 138, 0.12)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Booking Revenue (₹)',
        data: trendRevenue.length ? trendRevenue : [0],
        borderColor: '#d97706',
        backgroundColor: 'rgba(217, 119, 6, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        yAxisID: 'y1',
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Bookings' },
        ticks: { stepSize: 1 },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Revenue (₹)' },
      },
    },
  };

  // Occupancy Chart Data
  const occLabels = occupancy.map((o) => o.category);
  const occCounts = occupancy.map((o) => o.count);

  const doughnutData = {
    labels: occLabels.length ? occLabels : ['Available', 'Occupied', 'Maintenance', 'Out of Service'],
    datasets: [
      {
        data: occCounts.length ? occCounts : [0, 0, 0, 0],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e'],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="content-wrapper">
      {/* Top Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Enterprise Hotel Management Dashboard</h2>
          <p>Real-time property operations, guest registry, room occupancy, and booking analytics</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary btn-sm" onClick={loadDashboardData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-gold btn-sm" onClick={openNewReservation}>
            <PlusCircle size={15} />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          label="Total Properties"
          value={summary?.totalHotels ?? '—'}
          subtitle="Operating hotel branches"
          icon={Building2}
          color="stat-blue"
        />
        <StatsCard
          label="Total Rooms"
          value={summary?.totalRooms ?? '—'}
          subtitle="Across all categories"
          icon={BedDouble}
          color="stat-violet"
        />
        <StatsCard
          label="Available Rooms"
          value={summary?.availableRooms ?? '—'}
          subtitle="Ready for guest check-in"
          icon={CheckCircle2}
          color="stat-emerald"
        />
        <StatsCard
          label="Occupied Rooms"
          value={summary?.occupiedRooms ?? '—'}
          subtitle="Currently checked-in"
          icon={UserCheck}
          color="stat-cyan"
        />
        <StatsCard
          label="Registered Guests"
          value={summary?.totalGuests ?? '—'}
          subtitle="Verified guest directory"
          icon={Users}
          color="stat-amber"
        />
        <StatsCard
          label="Total Bookings"
          value={summary?.totalReservations ?? '—'}
          subtitle="All recorded stays"
          icon={CalendarCheck}
          color="stat-rose"
        />
        <StatsCard
          label="Active Stays"
          value={summary?.activeCheckIns ?? '—'}
          subtitle="Guests presently in rooms"
          icon={LogIn}
          color="stat-emerald"
        />
        <StatsCard
          label="Gross Revenue"
          value={`₹${Number(summary?.totalRevenue || 0).toLocaleString()}`}
          subtitle="Completed payments total"
          icon={IndianRupee}
          color="stat-amber"
        />
      </div>

      {/* Analytics Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: 'var(--slate-900)' }}>
            Reservation & Revenue Trends
          </h3>
          <div style={{ height: '260px' }}>
            <Line data={trendChartData} options={trendChartOptions} />
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: 'var(--slate-900)' }}>
            Room Status Distribution
          </h3>
          <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div style={{ background: '#fff', padding: '18px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--slate-900)' }}>
          Quick Administration Shortcuts:
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={openNewHotel}>
            <Building2 size={15} /> Add Hotel
          </button>
          <button className="btn btn-secondary btn-sm" onClick={openNewRoom}>
            <BedDouble size={15} /> Add Room
          </button>
          <button className="btn btn-secondary btn-sm" onClick={openNewGuest}>
            <Users size={15} /> Register Guest
          </button>
          <button className="btn btn-primary btn-sm" onClick={openNewReservation}>
            <CalendarCheck size={15} /> Book Reservation
          </button>
        </div>
      </div>

      {/* Recent Reservations Table */}
      <div className="table-container">
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>Recent Reservations</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>Latest bookings recorded across hotel locations</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('reservations')}>
            View All Bookings
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Guest</th>
                <th>Hotel & Room</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Nights</th>
                <th>Total Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-500)' }}>
                    No recent reservations found in database.
                  </td>
                </tr>
              ) : (
                recentReservations.map((res) => (
                  <tr key={res.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>#{res.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{res.guestName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{res.guestEmail}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{res.hotelName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        Room {res.roomNumber} ({res.roomType})
                      </div>
                    </td>
                    <td>{res.checkInDate}</td>
                    <td>{res.checkOutDate}</td>
                    <td>{res.numberOfNights}</td>
                    <td style={{ fontWeight: 700 }}>₹{Number(res.totalCost).toLocaleString()}</td>
                    <td>
                      <Badge status={res.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {res.status === 'CONFIRMED' && (
                          <button
                            className="btn btn-sm btn-secondary"
                            title="Check-In Guest"
                            onClick={() => handleQuickStatusUpdate(res.id, 'CHECKED_IN')}
                          >
                            Check-In
                          </button>
                        )}
                        {res.status === 'CHECKED_IN' && (
                          <button
                            className="btn btn-sm btn-secondary"
                            title="Check-Out Guest"
                            onClick={() => handleQuickStatusUpdate(res.id, 'CHECKED_OUT')}
                          >
                            Check-Out
                          </button>
                        )}
                        <button
                          className="btn btn-icon-only"
                          title="View Details in Reservations"
                          onClick={() => setActiveTab('reservations')}
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
    </div>
  );
}
