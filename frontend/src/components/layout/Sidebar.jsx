import React from 'react';
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  Users,
  CalendarCheck,
  CreditCard,
  Hotel,
  Github,
  Linkedin,
  Instagram,
  Code2,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'rooms', label: 'Rooms & Inventory', icon: BedDouble },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'reservations', label: 'Reservations', icon: CalendarCheck },
    { id: 'payments', label: 'Payments & Billing', icon: CreditCard },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <Hotel size={24} />
        </div>
        <div className="brand-text">
          <h1>GrandStay ERP</h1>
          <p>Hospitality Suite</p>
        </div>
      </div>

      <nav className="nav-section">
        <div className="nav-section-title">Navigation Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Developer Profile & Social Links */}
      <div style={{
        padding: '16px 18px',
        margin: '0 12px 14px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--radius-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Code2 size={16} style={{ color: '#fbbf24' }} />
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fbbf24', fontWeight: 700 }}>
            Lead Developer
          </span>
        </div>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
          KARTHIKEYAN M
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginBottom: '10px' }}>
          Full-Stack Software Engineer
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a
            href="https://github.com/karthikeyan2172008888-code"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              transition: 'background 0.2s',
              textDecoration: 'none',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          >
            <Github size={15} />
          </a>

          <a
            href="https://www.linkedin.com/in/karthikeyan-m-2491b1429?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn Profile"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              transition: 'background 0.2s',
              textDecoration: 'none',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          >
            <Linkedin size={15} />
          </a>

          <a
            href="https://www.instagram.com/kxrthikeyyan?stkn=azdxb3U3YTh2MXM2"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram Profile"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f43f5e',
              transition: 'background 0.2s',
              textDecoration: 'none',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          >
            <Instagram size={15} />
          </a>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="admin-avatar">KM</div>
        <div className="admin-info">
          <div className="name">KARTHIKEYAN M</div>
          <div className="role">Hospitality Operations Admin</div>
        </div>
      </div>
    </aside>
  );
}
