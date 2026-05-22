const express = require('express');
const { sequelize, Op, Schedule, Hall, Cinema, Movie, Reservation, ReservedSeat } = require('../database');
const { broadcastSeatsUpdate } = require('../ws');

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Authentication required' });
  next();
}

// Confirm the new reservation stored in the session
router.post('/', requireAuth, async (req, res) => {
  const pending = req.session.pendingSeats;
  if (!pending) {
    return res.status(400).json({ error: 'No pending seat selection found in session' });
  }

  const { scheduleId, seats } = pending;

  try {
    const existingReservations = await Reservation.findAll({
      where: { scheduleId },
      include: [{ model: ReservedSeat, attributes: ['rowNum', 'colNum'] }],
    });
    const taken = existingReservations.flatMap(r => r.ReservedSeats);
    const conflicts = seats.filter(s =>
      taken.some(t => t.rowNum === s.row && t.colNum === s.col)
    );
    if (conflicts.length > 0) {
      return res.status(409).json({
        error: 'Some seats were reserved by another user. Please choose different seats.',
      });
    }

    const reservation = await sequelize.transaction(async t => {
      const r = await Reservation.create(
        { userId: req.session.userId, scheduleId },
        { transaction: t }
      );
      await ReservedSeat.bulkCreate(
        seats.map(s => ({ reservationId: r.id, rowNum: s.row, colNum: s.col })),
        { transaction: t }
      );
      return r;
    });

    delete req.session.pendingSeats;
    broadcastSeatsUpdate(scheduleId);
    res.status(201).json({ reservationId: reservation.id, message: 'Reservation confirmed' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit an existing reservation — replace its seats
router.put('/:id', requireAuth, async (req, res) => {
  const reservationId = parseInt(req.params.id);
  const { seats } = req.body;

  if (!seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ error: 'At least one seat is required' });
  }

  try {
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    if (reservation.userId !== req.session.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Check new seats are not taken by OTHER reservations for the same showing
    const others = await Reservation.findAll({
      where: { scheduleId: reservation.scheduleId, id: { [Op.ne]: reservationId } },
      include: [{ model: ReservedSeat, attributes: ['rowNum', 'colNum'] }],
    });
    const takenByOthers = others.flatMap(r => r.ReservedSeats);
    const conflicts = seats.filter(s =>
      takenByOthers.some(t => t.rowNum === s.row && t.colNum === s.col)
    );
    if (conflicts.length > 0) {
      return res.status(409).json({
        error: 'Some of the selected seats are now taken. Please choose different seats.',
      });
    }

    await sequelize.transaction(async t => {
      await ReservedSeat.destroy({ where: { reservationId }, transaction: t });
      await ReservedSeat.bulkCreate(
        seats.map(s => ({ reservationId, rowNum: s.row, colNum: s.col })),
        { transaction: t }
      );
    });

    broadcastSeatsUpdate(reservation.scheduleId);
    res.json({ message: 'Reservation updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel a reservation
router.delete('/:id', requireAuth, async (req, res) => {
  const reservationId = parseInt(req.params.id);

  try {
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    if (reservation.userId !== req.session.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { scheduleId } = reservation;
    await sequelize.transaction(async t => {
      await ReservedSeat.destroy({ where: { reservationId }, transaction: t });
      await reservation.destroy({ transaction: t });
    });

    broadcastSeatsUpdate(scheduleId);
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List the current user's reservations
router.get('/my', requireAuth, async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.session.userId },
      include: [
        {
          model: Schedule,
          include: [
            { model: Movie, attributes: ['title', 'duration', 'genre'] },
            {
              model: Hall,
              attributes: ['name'],
              include: [{ model: Cinema, attributes: ['name'] }],
            },
          ],
        },
        { model: ReservedSeat, attributes: ['rowNum', 'colNum'] },
      ],
      order: [[Schedule, 'date', 'DESC'], [Schedule, 'startTime', 'DESC']],
    });

    res.json(
      reservations.map(r => ({
        id:         r.id,
        createdAt:  r.createdAt,
        scheduleId: r.scheduleId,
        title:      r.Schedule.Movie.title,
        duration:   r.Schedule.Movie.duration,
        genre:      r.Schedule.Movie.genre,
        date:       r.Schedule.date,
        startTime:  r.Schedule.startTime,
        hallName:   r.Schedule.Hall.name,
        cinemaName: r.Schedule.Hall.Cinema.name,
        seats:      r.ReservedSeats.map(rs => ({ row: rs.rowNum, col: rs.colNum })),
      }))
    );
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
