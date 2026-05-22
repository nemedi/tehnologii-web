const express = require('express');
const { Schedule, Hall, Cinema, Movie, Reservation, ReservedSeat } = require('../database');

const router = express.Router();

router.get('/:id/seats', async (req, res) => {
  try {
    const scheduleId = parseInt(req.params.id);

    const s = await Schedule.findByPk(scheduleId, {
      include: [
        { model: Movie, attributes: ['title', 'duration', 'genre'] },
        {
          model: Hall,
          attributes: ['name', 'rows', 'cols', 'hasMiddleAisle'],
          include: [{ model: Cinema, attributes: ['name'] }],
        },
      ],
    });

    if (!s) return res.status(404).json({ error: 'Schedule not found' });

    // Flatten into the shape SeatMap expects
    const schedule = {
      id:            s.id,
      date:          s.date,
      startTime:     s.startTime,
      title:         s.Movie.title,
      duration:      s.Movie.duration,
      genre:         s.Movie.genre,
      hallName:      s.Hall.name,
      rows:          s.Hall.rows,
      cols:          s.Hall.cols,
      hasMiddleAisle: s.Hall.hasMiddleAisle,
      cinemaName:    s.Hall.Cinema.name,
    };

    const reservations = await Reservation.findAll({
      where: { scheduleId },
      include: [{ model: ReservedSeat, attributes: ['rowNum', 'colNum'] }],
    });

    const reservedSeats = reservations.flatMap(r =>
      r.ReservedSeats.map(rs => ({ rowNum: rs.rowNum, colNum: rs.colNum }))
    );

    res.json({ schedule, reservedSeats });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Store the user's seat selection in the server session
router.post('/:id/select', (req, res) => {
  const scheduleId = parseInt(req.params.id);
  const { seats } = req.body;
  if (!seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ error: 'No seats provided' });
  }
  req.session.pendingSeats = { scheduleId, seats };
  res.json({ message: 'Seats stored in session' });
});

module.exports = router;
