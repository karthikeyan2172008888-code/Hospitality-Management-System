import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle,
  IndianRupee,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { paymentApi, reservationApi } from '../api/client';

export default function Payments({
  showToast,
  targetReservation,
  clearTargetReservation,
}) {
  const [payments, setPayments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Form
  const [selectedResId, setSelectedResId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [transactionReference, setTransactionReference] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsData, resData] = await Promise.all([
        paymentApi.getAll(),
        reservationApi.getAll(),
      ]);
      setPayments(paymentsData || []);
      setReservations(resData || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle target reservation passed from Reservations or Dashboard page
  useEffect(() => {
    if (targetReservation) {
      setSelectedResId(targetReservation.id);
      const balance = Number(targetReservation.remainingBalance || targetReservation.totalCost || 0);
      setAmount(balance > 0 ? balance : 1000);
      setIsRecordModalOpen(true);
      clearTargetReservation();
    }
  }, [targetReservation]);

  const handleOpenRecord = () => {
    if (reservations.length > 0) {
      setSelectedResId(reservations[0].id);
      setAmount(reservations[0].remainingBalance > 0 ? reservations[0].remainingBalance : 2000);
    }
    setPaymentMethod('CARD');
    setTransactionReference('');
    setIsRecordModalOpen(true);
  };

  const handleReservationChange = (id) => {
    setSelectedResId(id);
    const chosen = reservations.find((r) => r.id === Number(id));
    if (chosen && chosen.remainingBalance > 0) {
      setAmount(chosen.remainingBalance);
    }
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResId || !amount) {
      showToast('Please select reservation and specify payment amount', 'error');
      return;
    }

    try {
      await paymentApi.record({
        reservationId: Number(selectedResId),
        amount: Number(amount),
        paymentMethod: paymentMethod,
        transactionReference: transactionReference || undefined,
      });
      showToast(`Payment of ₹${Number(amount).toLocaleString()} recorded successfully!`, 'success');
      setIsRecordModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const selectedRes = reservations.find((r) => r.id === Number(selectedResId));

  return (
    <div className="content-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Billing Ledger & Payment Processing</h2>
          <p>Record guest transactions, reconcile outstanding balances, and track payment history</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary btn-sm" onClick={loadData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-gold btn-sm" onClick={handleOpenRecord}>
            <Plus size={15} />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Booking #</th>
                <th>Guest Name</th>
                <th>Hotel & Room</th>
                <th>Amount Paid</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Reference / Ref Code</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                    Loading payment records...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>#PAY-{p.id}</td>
                    <td style={{ fontWeight: 700 }}>#{p.reservationId}</td>
                    <td style={{ fontWeight: 600 }}>{p.guestName}</td>
                    <td>{p.hotelName} (Room {p.roomNumber})</td>
                    <td style={{ fontWeight: 800, color: 'var(--emerald-700)' }}>
                      ₹{Number(p.amount).toLocaleString()}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--slate-700)' }}>{p.paymentMethod}</span>
                    </td>
                    <td>
                      <Badge status={p.paymentStatus} />
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--slate-600)' }}>
                      {p.transactionReference}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Reservation Payment Transaction"
        size="md"
      >
        <form onSubmit={handleRecordSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group col-span-2">
                <label className="form-label">Select Reservation <span className="required">*</span></label>
                <select
                  required
                  className="form-control"
                  value={selectedResId}
                  onChange={(e) => handleReservationChange(e.target.value)}
                >
                  <option value="">Choose Booking...</option>
                  {reservations.map((r) => (
                    <option key={r.id} value={r.id}>
                      #{r.id} — {r.guestName} ({r.hotelName}, Room {r.roomNumber}) [Due: ₹{r.remainingBalance}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Balance Indicator Preview */}
              {selectedRes && (
                <div className="col-span-2" style={{ background: 'var(--slate-50)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Total Booking Cost:</span>
                    <strong>₹{Number(selectedRes.totalCost).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Previously Paid:</span>
                    <strong style={{ color: 'var(--emerald-700)' }}>₹{Number(selectedRes.totalPaid || 0).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--slate-300)', paddingTop: '6px' }}>
                    <span>Remaining Balance Due:</span>
                    <strong style={{ color: Number(selectedRes.remainingBalance || 0) > 0 ? 'var(--rose-700)' : 'var(--emerald-700)' }}>
                      ₹{Number(selectedRes.remainingBalance || 0).toLocaleString()}
                    </strong>
                  </div>
                </div>
              )}

              <div className="form-group col-span-2">
                <label className="form-label">Payment Amount (₹) <span className="required">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  className="form-control"
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Payment Method <span className="required">*</span></label>
                <select
                  required
                  className="form-control"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="CARD">Credit / Debit Card</option>
                  <option value="UPI">UPI / QR Code</option>
                  <option value="CASH">Cash at Desk</option>
                </select>
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Transaction Reference (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Auto-generated if left blank (e.g. CARD-20261011-ABC)"
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsRecordModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={15} /> Confirm Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
