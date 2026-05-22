const express = require('express');
const { Cinema, Hall, Movie, Schedule, Op, seedWeekIfNeeded } = require('../database');

function localDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMondayOf(d) {
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return monday;
}

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cinemas = await Cinema.findAll({ order: [['name', 'ASC']] });
    res.json(cinemas);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/schedule', async (req, res) => {
  try {
    const cinemaId = parseInt(req.params.id);

    // Determine Monday of the requested week (?from=YYYY-MM-DD), defaulting to current week
    let monday;
    if (req.query.from) {
      const d = new Date(req.query.from + 'T12:00:00');
      if (!isNaN(d.getTime())) monday = getMondayOf(d);
    }
    if (!monday) monday = getMondayOf(new Date());

    const fromDate = localDate(monday);
    const sundayDate = new Date(monday);
    sundayDate.setDate(monday.getDate() + 6);
    const toDate = localDate(sundayDate);

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return localDate(d);
    });

    await seedWeekIfNeeded(weekDates);

    const rows = await Schedule.findAll({
      include: [
        { model: Movie, attributes: ['id', 'title', 'duration', 'genre'] },
        { model: Hall,  attributes: ['id', 'name'], where: { cinemaId }, required: true },
      ],
      where: { date: { [Op.between]: [fromDate, toDate] } },
      order: [['date', 'ASC'], ['startTime', 'ASC']],
    });

    const schedule = {};
    rows.forEach(s => {
      const item = {
        id:        s.id,
        date:      s.date,
        startTime: s.startTime,
        hallId:    s.Hall.id,
        movieId:   s.Movie.id,
        title:     s.Movie.title,
        duration:  s.Movie.duration,
        genre:     s.Movie.genre,
        hallName:  s.Hall.name,
      };
      if (!schedule[s.date]) schedule[s.date] = [];
      schedule[s.date].push(item);
    });

    res.json({ cinemaId, fromDate, toDate, schedule });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
