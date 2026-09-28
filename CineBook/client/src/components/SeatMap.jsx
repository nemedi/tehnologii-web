import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReservationModal from './ReservationModal';

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function validateAdjacency(seats, cols, hasMiddleAisle) {
  if (seats.length <= 1) return '';

  const rows = [...new Set(seats.map(s => s.row))];
  const colNums = [...new Set(seats.map(s => s.col))];

  if (rows.length === 1) {
    const sorted = [...colNums].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] - sorted[i - 1] !== 1) {
        return 'Seats must be consecutive — no gaps allowed';
      }
    }
    if (hasMiddleAisle) {
      const mid = Math.floor(cols / 2);
      if (sorted[0] <= mid && sorted[sorted.length - 1] > mid) {
        return 'Cannot select seats across the middle aisle';
      }
    }
    return '';
  }

  if (colNums.length === 1) {
    const sorted = [...rows].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] - sorted[i - 1] !== 1) {
        return 'Seats must be consecutive — no gaps allowed';
      }
    }
    return '';
  }

  return 'Selected seats must all be in the same row or the same column';
}

function SeatMap({ currentUser, requireLogin }) {
  const { scheduleId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const editReservation = state?.editReservation ?? null;

  const [hallData, setHallData] = useState(null);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(editReservation?.seats || []);
  const [selectionError, setSelectionError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const ownSeatKeys = editReservation
    ? new Set(editReservation.seats.map(s => `${s.row}-${s.col}`))
    : new Set();

  const fetchSeats = useCallback(async () => {
    const r = await fetch(`/api/schedules/${scheduleId}/seats`, { credentials: 'include' });
    const data = await r.json();
    setHallData(data.schedule);
    setReservedSeats(data.reservedSeats);
    setLoading(false);
  }, [scheduleId]);

  const fetchSeatsRef = useRef(fetchSeats);
  useEffect(() => { fetchSeatsRef.current = fetchSeats; }, [fetchSeats]);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = process.env.NODE_ENV === 'production'
      ? window.location.host
      : `${window.location.hostname}:3001`;
    const socket = new WebSocket(`${protocol}//${wsHost}/ws`);
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ type: 'subscribe', scheduleId }));
    });
    socket.addEventListener('message', event => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'seats_updated') fetchSeatsRef.current();
      } catch {}
    });
    return () => socket.close();
  }, [scheduleId]);

  const isReserved = (row, col) => {
    if (ownSeatKeys.has(`${row}-${col}`)) return false;
    return reservedSeats.some(s => s.rowNum === row && s.colNum === col);
  };

  const isSelected = (row, col) =>
    selectedSeats.some(s => s.row === row && s.col === col);

  const handleSeatClick = (row, col) => {
    if (isReserved(row, col)) return;

    const next = isSelected(row, col)
      ? selectedSeats.filter(s => !(s.row === row && s.col === col))
      : [...selectedSeats, { row, col }];

    setSelectedSeats(next);
    setSelectionError(
      next.length > 0
        ? validateAdjacency(next, hallData.cols, hallData.hasMiddleAisle)
        : ''
    );
  };

  const handleReserveClick = () => {
    const err = validateAdjacency(selectedSeats, hallData.cols, hallData.hasMiddleAisle);
    if (err) { setSelectionError(err); return; }

    if (editReservation) {
      setShowConfirm(true);
      return;
    }

    requireLogin(async () => {
      await fetch(`/api/schedules/${scheduleId}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ seats: selectedSeats }),
      });
      setShowConfirm(true);
    });
  };

  const handleConfirm = async () => {
    if (editReservation) {
      const r = await fetch(`/api/reservations/${editReservation.reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ seats: selectedSeats }),
      });
      const data = await r.json();
      if (data.message) {
        setShowConfirm(false);
        navigate('/my-reservations');
      } else {
        alert(data.error || 'Update failed. Please try again.');
        setShowConfirm(false);
        fetchSeats();
      }
      return;
    }

    const r = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await r.json();
    if (data.reservationId) {
      setShowConfirm(false);
      navigate('/my-reservations');
    } else {
      alert(data.error || 'Reservation failed. Please try again.');
      setShowConfirm(false);
      setSelectedSeats([]);
      fetchSeats();
    }
  };

  if (loading) return <div className="loading">Loading seat map…</div>;

  const { rows, cols, hasMiddleAisle } = hallData;
  const midCol = hasMiddleAisle ? Math.floor(cols / 2) : null;
  const isSelectionValid = selectionError === '' && selectedSeats.length > 0;

  return (
    <div className="seatmap-page">
      <button
        className="btn btn-back"
        onClick={() => navigate(editReservation ? '/my-reservations' : -1)}
      >
        &#8592; {editReservation ? 'Back to My Reservations' : 'Back to Schedule'}
      </button>

      {editReservation && (
        <div className="edit-banner">
          &#9998; Editing reservation — your current seats are pre-selected.
          Add or remove seats, then click <strong>Update Seats</strong>.
        </div>
      )}

      <div className="seatmap-header">
        <div className="seatmap-title">{hallData.title}</div>
        <div className="seatmap-meta">
          {hallData.date} at {hallData.startTime} &nbsp;&bull;&nbsp; {hallData.hallName}
          &nbsp;&bull;&nbsp; {hallData.cinemaName}
          {hasMiddleAisle ? ' (middle aisle)' : ''}
        </div>
      </div>

      <div className="seatmap-scroll">
        <div className="seatmap-inner">
        <div className="seatmap-grid-wrap">
        <div className="screen-label">
          S C R E E N
        </div>

        <div className="seat-grid">
          <div className="seat-row">
            <div className="row-label" />
            <div className="aisle-spacer" />
            {Array.from({ length: cols }, (_, ci) => {
              const colNum = ci + 1;
              return (
                <React.Fragment key={colNum}>
                  <div className="col-num">{colNum}</div>
                  {hasMiddleAisle && colNum === midCol && <div className="aisle-spacer" />}
                </React.Fragment>
              );
            })}
            <div className="aisle-spacer" />
          </div>

          {Array.from({ length: rows }, (_, ri) => {
            const rowNum = ri + 1;
            return (
              <div key={rowNum} className="seat-row">
                <div className="row-label" title={`Row ${rowNum}`}>
                  {ROW_LETTERS[ri] || rowNum}
                </div>

                <div className="aisle-path" title="Access path" />

                {Array.from({ length: cols }, (_, ci) => {
                  const colNum = ci + 1;
                  const reserved = isReserved(rowNum, colNum);
                  const selected = isSelected(rowNum, colNum);

                  const cellClass =
                    'seat-cell ' +
                    (reserved ? 'seat-reserved' : selected ? 'seat-selected' : 'seat-available');

                  const label = `Row ${ROW_LETTERS[ri] || rowNum}, Seat ${colNum}`;

                  return (
                    <React.Fragment key={colNum}>
                      <div
                        className={cellClass}
                        onClick={() => handleSeatClick(rowNum, colNum)}
                        title={reserved ? `${label} — Reserved` : label}
                        role="button"
                        aria-label={label}
                        aria-pressed={selected}
                        aria-disabled={reserved}
                      />
                      {hasMiddleAisle && colNum === midCol && (
                        <div className="aisle-path" title="Middle access path" />
                      )}
                    </React.Fragment>
                  );
                })}

                <div className="aisle-path" title="Access path" />
              </div>
            );
          })}
        </div>
        </div>{/* /seatmap-grid-wrap */}
        </div>{/* /seatmap-inner */}
      </div>{/* /seatmap-scroll */}

      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: '#2d5a27', borderColor: '#3a7a34' }} />
          Available
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: '#4a1a1a', borderColor: '#6a2a2a' }} />
          Reserved
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: '#1a5a9a', borderColor: '#2a80d0' }} />
          Selected
        </div>
      </div>

      <div className="seatmap-actions">
        <div className="seatmap-buttons">
          <button
            className="btn btn-primary"
            disabled={!isSelectionValid}
            onClick={handleReserveClick}
          >
            {editReservation ? 'Update' : 'Reserve'}{' '}
            {selectedSeats.length > 0
              ? `${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''}`
              : 'Seats'}
          </button>

          {selectedSeats.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSelectedSeats([]);
                setSelectionError('');
              }}
            >
              Clear
            </button>
          )}
        </div>

        {selectionError && (
          <span className="selection-error">{selectionError}</span>
        )}
        {!selectionError && selectedSeats.length === 0 && (
          <span className="selection-hint">
            Click seats to select them. Adjacent seats in the same row or column only.
          </span>
        )}
      </div>

      {showConfirm && (
        <ReservationModal
          schedule={hallData}
          seats={selectedSeats}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
          isEditMode={!!editReservation}
        />
      )}
    </div>
  );
}

export default SeatMap;
