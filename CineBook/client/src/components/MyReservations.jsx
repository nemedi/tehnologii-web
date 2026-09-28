import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function MyReservations({ currentUser, requireLogin }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      const r = await fetch('/api/reservations/my', { credentials: 'include' });
      const data = await r.json();
      setReservations(data);
      setLoading(false);
    })();
  }, [currentUser]);

  const handleCancel = async id => {
    const r = await fetch(`/api/reservations/${id}`, { method: 'DELETE', credentials: 'include' });
    const data = await r.json();
    if (data.message) {
      setReservations(prev => prev.filter(r => r.id !== id));
    } else {
      alert(data.error || 'Failed to cancel reservation');
    }
    setCancelConfirmId(null);
  };

  const handleEdit = reservation => {
    navigate(`/schedule/${reservation.scheduleId}`, {
      state: {
        editReservation: { reservationId: reservation.id, seats: reservation.seats },
      },
    });
  };

  const formatDate = dateStr => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) return <div className="loading">Loading reservations…</div>;

  if (!currentUser) {
    return (
      <div>
        <button className="btn btn-back" onClick={() => navigate('/')}>
          &#8592; Back
        </button>
        <div className="empty-state">
          <p>Please login to see your reservations.</p>
          <button className="btn btn-primary" onClick={() => requireLogin(() => {})}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn-back" onClick={() => navigate('/')}>
        &#8592; Back to Cinemas
      </button>
      <h1 className="page-title">My Reservations</h1>

      {reservations.length === 0 ? (
        <div className="empty-state">
          <p>You have no reservations yet.</p>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map(r => (
            <div key={r.id} className="reservation-card">
              <div className="reservation-top">
                <div className="reservation-movie">{r.title}</div>
                <div className="reservation-when">
                  {r.startTime} &mdash; {formatDate(r.date)}
                </div>
              </div>
              <div className="reservation-details">
                {r.cinemaName} &middot; {r.hallName} &middot; {r.duration} min &middot;{' '}
                {r.genre}
              </div>
              <div className="reservation-seats">
                {r.seats
                  .sort((a, b) => a.row - b.row || a.col - b.col)
                  .map((s, i) => (
                    <span key={i} className="seat-badge">
                      {ROW_LETTERS[s.row - 1] || s.row}
                      {s.col}
                    </span>
                  ))}
              </div>
              <div className="reservation-booked">
                Booked: {new Date(r.createdAt).toLocaleDateString()}
              </div>

              <div className="reservation-actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(r)}>
                  Edit Seats
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setCancelConfirmId(r.id)}
                >
                  Cancel Reservation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cancelConfirmId !== null && (() => {
        const r = reservations.find(x => x.id === cancelConfirmId);
        return r ? (
          <div className="modal-overlay" onClick={() => setCancelConfirmId(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Cancel Reservation?</h2>
              <div className="confirm-summary">
                <div className="confirm-movie">{r.title}</div>
                <div className="confirm-detail">
                  {r.startTime} &mdash; {formatDate(r.date)}
                </div>
                <div className="confirm-detail">
                  {r.cinemaName} &middot; {r.hallName}
                </div>
              </div>
              <p className="cancel-dialog-msg">
                This will permanently remove your booking. Are you sure?
              </p>
              <div className="confirm-actions">
                <button className="btn btn-danger" onClick={() => handleCancel(cancelConfirmId)}>
                  Yes, cancel it
                </button>
                <button className="btn btn-secondary" onClick={() => setCancelConfirmId(null)}>
                  Keep reservation
                </button>
              </div>
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
}

export default MyReservations;
