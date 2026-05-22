const http = require('http');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const connectSqlite3 = require('connect-sqlite3');

const authRoutes = require('./routes/auth');
const cinemaRoutes = require('./routes/cinemas');
const scheduleRoutes = require('./routes/schedules');
const reservationRoutes = require('./routes/reservations');
const ws = require('./ws');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const SqliteStore = connectSqlite3(session);

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(
  session({
    store: new SqliteStore({
      db: 'sessions.db',
      dir: path.join(__dirname, '..'),
    }),
    secret: 'cinema-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/reservations', reservationRoutes);

// Serve React production build
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const { initDatabase } = require('./database');

async function start() {
  try {
    await initDatabase();
    ws.setup(server);
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  }
}

start();
