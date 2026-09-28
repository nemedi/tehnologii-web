import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CinemaList() {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const r = await fetch('/api/cinemas', { credentials: 'include' });
      const data = await r.json();
      setCinemas(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="loading">Loading cinemas…</div>;

  return (
    <div>
      <h1 className="page-title">Select a Cinema</h1>
      <p className="page-subtitle">Choose a cinema to see the weekly schedule</p>
      <div className="cinema-grid">
        {cinemas.map(cinema => (
          <div
            key={cinema.id}
            className="cinema-card"
            onClick={() => navigate(`/cinema/${cinema.id}`, { state: { cinema } })}
          >
            {cinema.imageUrl ? (
              <img
                className="cinema-image"
                src={cinema.imageUrl}
                alt={cinema.name}
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="cinema-image-placeholder" />
            )}
            <div className="cinema-card-body">
              <div className="cinema-name">{cinema.name}</div>
              <div className="cinema-address">&#128205; {cinema.address}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CinemaList;
