
import { connection } from "./connection";
import { Cinema, Hall, Movie, Reservation, Schedule, User } from "./associations.js";
import bcrypt from "bcrypt";

export async function initializeDatabase() {
  await connection.authenticate();
  await connection.sync({ alter: false });
}

async function getCinemas() {
  // TODO
}

async function getSchedule(cinemaId, date) {
  // TODO
}

async function getReservations(scheduleId, email, password) {
  // TODO
}

async function reserveSeat(scheduleId, seatRow, seatColumn, userId) {
  // TODO
}

async function releaseSeat(scheduleId, seatRow, seatColumn, userId) {
  // TODO
}

export default {
    initializeDatabase,
    getCinemas,
    getSchedule,
    getReservations,
    reserveSeat,
    releaseSeat
};