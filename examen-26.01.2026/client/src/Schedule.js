import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Schedule.css";

export default function Schedule() {
  const navigate = useNavigate();

  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [cinemaAddress, setCinemaAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO
  }, []);

  useEffect(() => {
    // TODO
  }, [selectedCinema, cinemas]);

  useEffect(() => {
    // TODO    
  }, [selectedCinema, selectedDate]);

  const handleHourClick = (movieId, hour) => {
    navigate(
      `/seat-reservation?cinema=${selectedCinema}&movie=${movieId}&date=${selectedDate}&hour=${hour}`
    );
  };

  return (
    <div className="cinema-container">
      <h1 className="cinema-title">Program cinema</h1>

      <div className="cinema-controls">
        <select
          className="cinema-select"
          value={selectedCinema}
          onChange={(e) => setSelectedCinema(e.target.value)}
        >
          <option value="">Selectează cinematograful</option>
          {cinemas.map((cinema) => (
            <option key={cinema.id} value={cinema.id}>
              {cinema.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="cinema-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {cinemaAddress && (
        <div className="cinema-address">
          <strong>Adresă:</strong> {cinemaAddress}
        </div>
      )}

      {loading && <p>Se încarcă filmele...</p>}

      {!loading && movies.length > 0 && (
        <div className="movie-list">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <div className="movie-poster">
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={movie.posterUrl} alt={movie.title} />
                </a>
              </div>

              <div className="movie-info">
                <div className="movie-title">{movie.title}</div>
                <div className="movie-meta">
                  {movie.type} | {movie.duration} min
                </div>

                <div className="movie-hours">
                  {movie.hours.map((hour) => (
                    <button
                      key={hour}
                      className="movie-hour-btn"
                      onClick={() => handleHourClick(movie.id, hour)}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && selectedCinema && selectedDate && movies.length === 0 && (
        <p>Nu există filme programate în această zi.</p>
      )}
    </div>
  );
}
