import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function localDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMondayDate(offsetWeeks = 0) {
  const today = new Date();
  const diff = today.getDay() === 0 ? -6 : 1 - today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + offsetWeeks * 7);
  return localDate(monday);
}

function formatWeekLabel(fromDateStr) {
  const from = new Date(fromDateStr + 'T12:00:00');
  const to = new Date(from);
  to.setDate(from.getDate() + 6);
  const toDay = to.getDate();
  const year = to.getFullYear();
  if (from.getMonth() === to.getMonth()) {
    const month = to.toLocaleDateString('en-GB', { month: 'long' });
    return `${from.getDate()}–${toDay} ${month} ${year}`;
  }
  const fromMonth = from.toLocaleDateString('en-GB', { month: 'short' });
  const toMonth = to.toLocaleDateString('en-GB', { month: 'short' });
  return `${from.getDate()} ${fromMonth} – ${toDay} ${toMonth} ${year}`;
}

const MIN_OFFSET = -4;
const MAX_OFFSET = 8;

function WeekSchedule() {
  const { cinemaId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const cinema = state?.cinema;

  const [schedule, setSchedule] = useState({});
  const [weekDates, setWeekDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);

  const fromDate = getMondayDate(weekOffset);

  useEffect(() => {
    setLoading(true);
    setError('');
    setSchedule({});
    (async () => {
      try {
        const r = await fetch(`/api/cinemas/${cinemaId}/schedule?from=${fromDate}`, { credentials: 'include' });
        const data = await r.json();
        if (data.error) throw new Error(data.error);
        setSchedule(data.schedule || {});
        const dates = [];
        const from = new Date(data.fromDate + 'T12:00:00');
        for (let i = 0; i < 7; i++) {
          const d = new Date(from);
          d.setDate(from.getDate() + i);
          dates.push(localDate(d));
        }
        setWeekDates(dates);
      } catch (err) {
        setError('Could not load schedule. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [cinemaId, fromDate]);

  const today = localDate(new Date());

  const formatDate = dateStr => {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <div>
      <button className="btn btn-back" onClick={() => navigate('/')}>
        &#8592; Back
      </button>
      <h1 className="page-title">{cinema?.name ?? 'Schedule'}</h1>

      <div className="week-nav">
        <button
          className="btn btn-secondary"
          onClick={() => setWeekOffset(o => o - 1)}
          disabled={weekOffset <= MIN_OFFSET}
        >
          &#8592; Prev week
        </button>

        <span className="week-label">{formatWeekLabel(fromDate)}</span>

        {weekOffset !== 0 && (
          <button className="btn btn-secondary" onClick={() => setWeekOffset(0)}>
            Current week
          </button>
        )}

        <button
          className="btn btn-secondary"
          onClick={() => setWeekOffset(o => o + 1)}
          disabled={weekOffset >= MAX_OFFSET}
        >
          Next week &#8594;
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading schedule…</div>
      ) : error ? (
        <div className="empty-state"><p>{error}</p></div>
      ) : (
        <>
          <p className="page-subtitle">Click a showtime to reserve seats</p>
          <div className="week-grid">
            {weekDates.map((date, idx) => (
              <div key={date} className="day-column">
                <div className={`day-header${date === today ? ' today' : ''}`}>
                  <div>{DAY_NAMES[idx]}</div>
                  <div className="day-date">{formatDate(date)}</div>
                </div>
                <div className="day-slots">
                  {(schedule[date] || []).length === 0 ? (
                    <div className="no-slots">No showings</div>
                  ) : (
                    (schedule[date] || []).map(slot => (
                      <div
                        key={slot.id}
                        className="schedule-slot"
                        onClick={() => navigate(`/schedule/${slot.id}`)}
                      >
                        <div className="slot-time">{slot.startTime}</div>
                        <div className="slot-title">{slot.title}</div>
                        <div className="slot-info">
                          {slot.hallName} &middot; {slot.duration} min
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default WeekSchedule;
