const { Sequelize, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');

function localDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMondayOfWeek(d = new Date()) {
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return monday;
}

function getWeekDates(offsetWeeks = 0) {
  const monday = getMondayOfWeek();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i + offsetWeeks * 7);
    return localDate(d);
  });
}

function makeScheduleRows(halls, movies, dates) {
  const rows = [];
  const add = (movie, hall, time, date) => {
    if (movie && hall) {
      rows.push({ movieId: movie.id, hallId: hall.id, startTime: time, date });
    }
  };
  const m = movies;
  const h = halls;

  dates.forEach(date => {
    // Cinema 1 — Standard
    add(m[0], h[0], '10:00', date); add(m[1], h[0], '13:30', date);
    add(m[2], h[0], '16:30', date); add(m[3], h[0], '20:00', date);
    // Cinema 1 — IMAX
    add(m[3], h[1], '11:00', date); add(m[4], h[1], '15:00', date);
    add(m[4], h[1], '19:30', date);
    // Cinema 1 — VIP
    add(m[8], h[2], '18:00', date); add(m[9], h[2], '21:00', date);
    // Cinema 2 — Hall A
    add(m[5], h[3], '10:30', date); add(m[6], h[3], '13:30', date);
    add(m[7], h[3], '17:00', date); add(m[8], h[3], '20:30', date);
    // Cinema 2 — Hall B
    add(m[0], h[4], '12:00', date); add(m[9], h[4], '16:00', date);
    add(m[5], h[4], '20:00', date);
    // Cinema 3 — Art Hall
    add(m[6], h[5], '11:00', date); add(m[7], h[5], '14:30', date);
    add(m[1], h[5], '18:00', date);
    // Cinema 4 — Hall 1
    add(m[10], h[6], '10:00', date); add(m[11], h[6], '13:00', date);
    add(m[12], h[6], '16:30', date); add(m[13], h[6], '20:00', date);
    // Cinema 4 — VIP
    add(m[14], h[7], '17:00', date); add(m[15], h[7], '20:30', date);
    // Cinema 5 — Main Hall
    add(m[12], h[8], '10:00', date); add(m[13], h[8], '13:30', date);
    add(m[14], h[8], '17:00', date); add(m[15], h[8], '20:30', date);
    // Cinema 5 — Cozy Hall
    add(m[16], h[9], '15:00', date); add(m[17], h[9], '19:00', date);
    // Cinema 6 — Hall A
    add(m[1], h[10], '10:30', date); add(m[2], h[10], '13:30', date);
    add(m[3], h[10], '16:30', date); add(m[18], h[10], '20:00', date);
    // Cinema 6 — Hall B
    add(m[4], h[11], '14:00', date); add(m[19], h[11], '19:00', date);
    // Cinema 7 — Screen 1
    add(m[5], h[12], '10:00', date); add(m[6], h[12], '13:00', date);
    add(m[7], h[12], '16:30', date); add(m[8], h[12], '20:00', date);
    // Cinema 7 — Screen 2
    add(m[16], h[13], '11:00', date); add(m[17], h[13], '15:30', date);
    add(m[18], h[13], '19:30', date);
    // Cinema 8 — Big Screen
    add(m[0], h[14], '10:00', date); add(m[3], h[14], '13:30', date);
    add(m[4], h[14], '17:00', date); add(m[9], h[14], '20:30', date);
    // Cinema 8 — Small Screen
    add(m[10], h[15], '14:00', date); add(m[11], h[15], '18:30', date);
    // Cinema 9 — Cinema 1
    add(m[12], h[16], '10:30', date); add(m[13], h[16], '13:30', date);
    add(m[14], h[16], '16:30', date); add(m[19], h[16], '20:00', date);
    // Cinema 9 — Cinema 2
    add(m[15], h[17], '12:00', date); add(m[16], h[17], '16:00', date);
    add(m[17], h[17], '20:00', date);
  });
  return rows;
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'cinema.db'),
  logging: false,
  define: {
    underscored: true,
    timestamps: false,
  },
});

// ── Models ──────────────────────────────────────────────────────────────────

const Cinema = sequelize.define('Cinema', {
  name:     { type: DataTypes.STRING, allowNull: false },
  address:  DataTypes.STRING,
  imageUrl: DataTypes.STRING,
}, { tableName: 'cinemas' });

const Hall = sequelize.define('Hall', {
  name:           { type: DataTypes.STRING,  allowNull: false },
  rows:           { type: DataTypes.INTEGER, allowNull: false },
  cols:           { type: DataTypes.INTEGER, allowNull: false },
  hasMiddleAisle: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'halls' });

const Movie = sequelize.define('Movie', {
  title:       { type: DataTypes.STRING,  allowNull: false },
  duration:    { type: DataTypes.INTEGER, allowNull: false },
  description: DataTypes.TEXT,
  genre:       DataTypes.STRING,
}, { tableName: 'movies' });

const Schedule = sequelize.define('Schedule', {
  startTime: { type: DataTypes.STRING, allowNull: false },
  date:      { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'schedules' });

const User = sequelize.define('User', {
  username:     { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'users' });

const Reservation = sequelize.define('Reservation', {}, {
  tableName:  'reservations',
  timestamps: true,
  updatedAt:  false,
});

const ReservedSeat = sequelize.define('ReservedSeat', {
  rowNum: { type: DataTypes.INTEGER, allowNull: false },
  colNum: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'reserved_seats' });

// ── Associations ─────────────────────────────────────────────────────────────

Cinema.hasMany(Hall,        { foreignKey: 'cinemaId' });
Hall.belongsTo(Cinema,      { foreignKey: 'cinemaId' });

Hall.hasMany(Schedule,      { foreignKey: 'hallId' });
Schedule.belongsTo(Hall,    { foreignKey: 'hallId' });

Movie.hasMany(Schedule,     { foreignKey: 'movieId' });
Schedule.belongsTo(Movie,   { foreignKey: 'movieId' });

User.hasMany(Reservation,        { foreignKey: 'userId' });
Reservation.belongsTo(User,      { foreignKey: 'userId' });

Schedule.hasMany(Reservation,    { foreignKey: 'scheduleId' });
Reservation.belongsTo(Schedule,  { foreignKey: 'scheduleId' });

Reservation.hasMany(ReservedSeat,    { foreignKey: 'reservationId' });
ReservedSeat.belongsTo(Reservation,  { foreignKey: 'reservationId' });

// ── Lazy week seeding ────────────────────────────────────────────────────────

async function seedWeekIfNeeded(dates) {
  const count = await Schedule.count({
    where: { date: { [Op.between]: [dates[0], dates[6]] } },
  });
  if (count === 0) {
    const halls  = await Hall.findAll({ order: [['id', 'ASC']] });
    const movies = await Movie.findAll({ order: [['id', 'ASC']] });
    if (halls.length > 0 && movies.length > 0) {
      await Schedule.bulkCreate(makeScheduleRows(halls, movies, dates));
    }
  }
}

// ── Init & Seed ──────────────────────────────────────────────────────────────

async function initDatabase() {
  await sequelize.sync();
  // Add image_url to cinemas if missing (safe no-op on fresh DBs)
  try {
    await sequelize.query('ALTER TABLE cinemas ADD COLUMN image_url TEXT');
  } catch (_) { /* column already exists */ }
  await seedData();
}

async function seedData() {
  const count = await Cinema.count();

  if (count > 0) {
    await seedWeekIfNeeded(getWeekDates());
    return;
  }

  // Cinemas
  const [c1, c2, c3, c4, c5, c6, c7, c8, c9] = await Cinema.bulkCreate([
    { name: 'Cinema City',    address: 'Str. Victoriei 10, București',    imageUrl: 'https://picsum.photos/seed/cinemacity/800/300'    },
    { name: 'Multiplex Star', address: 'Calea Moșilor 25, Cluj-Napoca',   imageUrl: 'https://picsum.photos/seed/multiplexstar/800/300' },
    { name: 'Art Cinema',     address: 'Bd. Independenței 5, Timișoara',  imageUrl: 'https://picsum.photos/seed/artcinema/800/300'     },
    { name: 'CineGold',       address: 'Str. Ștefan cel Mare 8, Iași',    imageUrl: 'https://picsum.photos/seed/cinegold/800/300'      },
    { name: 'Odeon',          address: 'Piața Sfatului 3, Brașov',        imageUrl: 'https://picsum.photos/seed/odeoncinema/800/300'   },
    { name: 'FilmHub',        address: 'Bd. Tomis 44, Constanța',         imageUrl: 'https://picsum.photos/seed/filmhub/800/300'       },
    { name: 'CinePlex',       address: 'Piața Mare 1, Sibiu',             imageUrl: 'https://picsum.photos/seed/cineplexsibiu/800/300' },
    { name: 'SilverScreen',   address: 'Str. Republicii 12, Oradea',      imageUrl: 'https://picsum.photos/seed/silverscreen/800/300'  },
    { name: 'Cinemax',        address: 'Calea București 30, Craiova',     imageUrl: 'https://picsum.photos/seed/cinemaxcv/800/300'     },
  ]);

  // Halls
  const halls = await Hall.bulkCreate([
    { cinemaId: c1.id, name: 'Standard',     rows: 12, cols: 20, hasMiddleAisle: false },
    { cinemaId: c1.id, name: 'IMAX',         rows: 10, cols: 24, hasMiddleAisle: false },
    { cinemaId: c1.id, name: 'VIP',          rows:  8, cols: 16, hasMiddleAisle: true  },
    { cinemaId: c2.id, name: 'Hall A',       rows: 15, cols: 22, hasMiddleAisle: false },
    { cinemaId: c2.id, name: 'Hall B',       rows: 10, cols: 18, hasMiddleAisle: true  },
    { cinemaId: c3.id, name: 'Art Hall',     rows: 10, cols: 14, hasMiddleAisle: false },
    { cinemaId: c4.id, name: 'Hall 1',       rows: 12, cols: 18, hasMiddleAisle: false },
    { cinemaId: c4.id, name: 'VIP',          rows:  8, cols: 14, hasMiddleAisle: true  },
    { cinemaId: c5.id, name: 'Main Hall',    rows: 14, cols: 20, hasMiddleAisle: false },
    { cinemaId: c5.id, name: 'Cozy Hall',    rows:  8, cols: 12, hasMiddleAisle: false },
    { cinemaId: c6.id, name: 'Hall A',       rows: 10, cols: 16, hasMiddleAisle: false },
    { cinemaId: c6.id, name: 'Hall B',       rows: 10, cols: 16, hasMiddleAisle: true  },
    { cinemaId: c7.id, name: 'Screen 1',     rows: 12, cols: 18, hasMiddleAisle: false },
    { cinemaId: c7.id, name: 'Screen 2',     rows: 10, cols: 14, hasMiddleAisle: false },
    { cinemaId: c8.id, name: 'Big Screen',   rows: 15, cols: 20, hasMiddleAisle: true  },
    { cinemaId: c8.id, name: 'Small Screen', rows:  8, cols: 12, hasMiddleAisle: false },
    { cinemaId: c9.id, name: 'Cinema 1',     rows: 12, cols: 16, hasMiddleAisle: false },
    { cinemaId: c9.id, name: 'Cinema 2',     rows:  8, cols: 14, hasMiddleAisle: false },
  ]);

  // Movies
  const movies = await Movie.bulkCreate([
    { title: 'Interstellar',                      duration: 169, genre: 'Sci-Fi',    description: 'A team of explorers travel through a wormhole in space.' },
    { title: 'The Dark Knight',                   duration: 152, genre: 'Action',    description: 'Batman faces the Joker in a battle for Gotham City.' },
    { title: 'Inception',                         duration: 148, genre: 'Thriller',  description: 'A thief who steals corporate secrets through dream-sharing.' },
    { title: 'Dune: Part Two',                    duration: 166, genre: 'Sci-Fi',    description: 'Paul Atreides unites with the Fremen to wage war.' },
    { title: 'Oppenheimer',                       duration: 180, genre: 'Drama',     description: 'The story of J. Robert Oppenheimer and the Manhattan Project.' },
    { title: 'The Matrix',                        duration: 136, genre: 'Sci-Fi',    description: 'A computer hacker learns the true nature of reality.' },
    { title: 'Parasite',                          duration: 132, genre: 'Thriller',  description: 'A poor family schemes to become employed by a wealthy family.' },
    { title: 'Everything Everywhere All at Once', duration: 139, genre: 'Comedy',    description: 'A woman discovers she can access parallel universes.' },
    { title: 'Poor Things',                       duration: 141, genre: 'Drama',     description: 'The amazing adventures of Bella Baxter, brought back to life.' },
    { title: 'The Substance',                     duration:  99, genre: 'Horror',    description: 'A fading celebrity uses a mysterious black market drug.' },
    { title: 'The Godfather',                     duration: 175, genre: 'Crime',     description: 'The aging patriarch of an organized crime dynasty transfers control.' },
    { title: 'Pulp Fiction',                      duration: 154, genre: 'Crime',     description: 'The lives of two hitmen, a boxer, and others intertwine.' },
    { title: 'The Shawshank Redemption',          duration: 142, genre: 'Drama',     description: 'Two imprisoned men bond over years, finding solace and redemption.' },
    { title: 'Fight Club',                        duration: 139, genre: 'Drama',     description: 'An insomniac office worker forms an underground fight club.' },
    { title: 'Blade Runner 2049',                 duration: 164, genre: 'Sci-Fi',    description: 'A blade runner uncovers a secret that could upend society.' },
    { title: 'Spirited Away',                     duration: 125, genre: 'Animation', description: 'A girl wanders into a world ruled by gods and witches.' },
    { title: 'Whiplash',                          duration: 107, genre: 'Drama',     description: 'A promising young drummer pursues perfection under a brutal teacher.' },
    { title: 'Arrival',                           duration: 116, genre: 'Sci-Fi',    description: 'A linguist works to communicate with alien lifeforms.' },
    { title: 'Get Out',                           duration: 104, genre: 'Horror',    description: "A Black man uncovers a terrifying secret at his girlfriend's parents' estate." },
    { title: 'La La Land',                        duration: 128, genre: 'Romance',   description: 'A jazz musician and an aspiring actress fall in love in Los Angeles.' },
  ]);

  await Schedule.bulkCreate(makeScheduleRows(halls, movies, getWeekDates()));

  // Users
  const hash = bcrypt.hashSync('password123', 10);
  const [john] = await User.bulkCreate([
    { username: 'john', passwordHash: hash },
    { username: 'jane', passwordHash: hash },
  ]);

  // Sample reservation for john on the first schedule
  const firstSchedule = await Schedule.findOne();
  if (firstSchedule) {
    const res = await Reservation.create({ userId: john.id, scheduleId: firstSchedule.id });
    await ReservedSeat.bulkCreate([
      { reservationId: res.id, rowNum: 5, colNum: 10 },
      { reservationId: res.id, rowNum: 5, colNum: 11 },
    ]);
  }
}

module.exports = {
  sequelize,
  Op,
  Cinema,
  Hall,
  Movie,
  Schedule,
  User,
  Reservation,
  ReservedSeat,
  initDatabase,
  seedWeekIfNeeded,
};
