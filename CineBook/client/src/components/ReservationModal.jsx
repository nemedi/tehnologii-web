import React from 'react';

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function ReservationModal({ schedule, seats, onConfirm, onCancel, isEditMode = false }) {
  const sorted = [...seats].sort((a, b) => a.row - b.row || a.col - b.col);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">{isEditMode ? 'Update Reservation' : 'Confirm Reservation'}</h2>

        <div className="confirm-summary">
          <div className="confirm-movie">{schedule.title}</div>
          <div className="confirm-detail">
            {schedule.date} at {schedule.startTime} &middot; {schedule.hallName}
          </div>
          <div className="confirm-detail">{schedule.cinemaName}</div>
        </div>

        <div className="confirm-seats-label">
          Selected seats ({seats.length}):
        </div>
        <div className="confirm-seats">
          {sorted.map((s, i) => (
            <span key={i} className="seat-chip">
              {ROW_LETTERS[s.row - 1] || s.row}
              {s.col}
            </span>
          ))}
        </div>

        <div className="confirm-actions" style={{ marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={onConfirm}>
            {isEditMode ? 'Save Changes' : 'Confirm'}
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationModal;
