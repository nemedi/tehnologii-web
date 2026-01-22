import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Reservation.css";

export default function SeatReservation() {
  const [searchParams] = useSearchParams();

  const cinema = searchParams.get("cinema");
  const movie = searchParams.get("movie");
  const date = searchParams.get("date");
  const hour = searchParams.get("hour");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [seatLayout, setSeatLayout] = useState([]);

  const [mySeats, setMySeats] = useState([]);
  const [otherSeats, setOtherSeats] = useState([]);

  const wsRef = useRef(null);

  useEffect(() => {
    // TODO
  }, [cinema, date, hour, movie]);

  const loadReservations = async () => {
    // TODO
  };

  useEffect(() => {
    // TODO
  }, []);

  const toggleSeat = (row, seat) => {
    // TODO
  };

  return (
    <div className="cinema-wrapper">
      <div className="login-box">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={loadReservations}>
          Next
        </button>
      </div>

      <div className="title">Selectează locurile</div>

      {seatLayout.length === 0 && (
        <p>Se încarcă sala...</p>
      )}

      <div className="room">
        {seatLayout.map((row, rowIndex) => {
          const rowNumber = rowIndex + 1;

          return (
            <div className="row" key={rowIndex}>
              <div className="row-number">{rowNumber}</div>

              <div className="seats">
                {row.map((seat, index) => {
                  if (seat === null) {
                    return (
                      <div key={index} className="empty" />
                    );
                  }

                  const seatKey = `${rowNumber}-${seat}`;
                  const isMine = mySeats.includes(seatKey);
                  const isOccupied =
                    otherSeats.includes(seatKey);

                  return (
                    <button
                      key={index}
                      disabled={isOccupied}
                      className={`seat
                        ${isMine ? "selected" : ""}
                        ${isOccupied ? "occupied" : ""}
                      `}
                      onClick={() =>
                        toggleSeat(rowNumber, seat)
                      }
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>

              <div className="row-number">
                {rowNumber}
              </div>
            </div>
          );
        })}
      </div>

      <div className="selected-info">
        <strong>Locurile tale:</strong>
        <br />
        {mySeats.length
          ? mySeats.join(", ")
          : "Niciun loc selectat"}
      </div>
    </div>
  );
}
