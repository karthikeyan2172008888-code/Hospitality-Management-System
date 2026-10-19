import React from 'react';

export default function Badge({ status, type = 'status' }) {
  if (!status) return null;

  const normalized = String(status).toUpperCase();
  let badgeClass = 'badge';
  let label = status;

  switch (normalized) {
    // Room Statuses
    case 'AVAILABLE':
      badgeClass += ' badge-available';
      label = 'Available';
      break;
    case 'OCCUPIED':
      badgeClass += ' badge-occupied';
      label = 'Occupied';
      break;
    case 'MAINTENANCE':
      badgeClass += ' badge-maintenance';
      label = 'Maintenance';
      break;
    case 'OUT_OF_SERVICE':
      badgeClass += ' badge-out-of-service';
      label = 'Out of Service';
      break;

    // Reservation Statuses
    case 'CONFIRMED':
      badgeClass += ' badge-confirmed';
      label = 'Confirmed';
      break;
    case 'CHECKED_IN':
      badgeClass += ' badge-checked-in';
      label = 'Checked In';
      break;
    case 'CHECKED_OUT':
      badgeClass += ' badge-checked-out';
      label = 'Checked Out';
      break;
    case 'CANCELLED':
      badgeClass += ' badge-cancelled';
      label = 'Cancelled';
      break;

    // Payment Statuses
    case 'COMPLETED':
      badgeClass += ' badge-completed';
      label = 'Completed';
      break;
    case 'PENDING':
      badgeClass += ' badge-pending';
      label = 'Pending';
      break;
    case 'REFUNDED':
      badgeClass += ' badge-refunded';
      label = 'Refunded';
      break;

    default:
      badgeClass += ' badge-occupied';
      label = status;
  }

  return <span className={badgeClass}>{label}</span>;
}
