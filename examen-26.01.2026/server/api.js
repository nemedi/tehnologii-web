import express from "express";
import { getCinemas, getSchedule, getReservations, reserveSeat, releaseSeat } from "./repository.js";
import { broadcastReserveEvent, broadcastReleaseEvent } from "./ev`ents.js";

const router = express.Router();

router.get("/cinemas", async (request, response) => {
  try {
    // TODO
  } catch (error) {
    console.error("Error GET /api/cinemas:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.get("/schedules", async (request, response) => {
  try {
    // TODO
  } catch (error) {
    console.error("Error GET /api/schedules:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.get("/reservations", async (request, response) => {
  try {
    // TODO
  } catch (error) {
    console.error("Error GET /api/reservations:", error);
    response.status(500).json({ error: "Internal server error" });
  }

});

router.post("/reservations", async (request, response) => {
  try {
    // TODO
  } catch (error) {
    console.error("Error POST /api/reservations:", error);
    response.status(400).json({ error: error.message });
  }
});

router.delete("/reservations", async (request, response) => {
  try {
    // TODO
  } catch (error) {
    console.error("Error DELETE /api/reservations:", error);
    response.status(400).json({ error: error.message });
  }
});

export default router;
