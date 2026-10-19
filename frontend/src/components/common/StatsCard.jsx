import React from 'react';

export default function StatsCard({ label, value, subtitle, icon: Icon, color = 'stat-blue' }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
      {Icon && (
        <div className={`stat-icon-wrapper ${color}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
