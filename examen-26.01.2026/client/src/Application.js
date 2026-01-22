import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import CinemaSchedule from "./CinemaSchedule";
import SeatReservation from "./SeatReservation";

export default function Application() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/cinema-schedule" replace />}
        />
        <Route
          path="/cinema-schedule"
          element={<CinemaSchedule />}
        />
        <Route
          path="/seat-reservation"
          element={<SeatReservation />}
        />
      </Routes>
    </HashRouter>
  );
}
