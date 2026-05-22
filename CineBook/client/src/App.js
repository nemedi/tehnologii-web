import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import CinemaList from './components/CinemaList';
import WeekSchedule from './components/WeekSchedule';
import SeatMap from './components/SeatMap';
import MyReservations from './components/MyReservations';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  // null | 'login' | 'register'
  const [authModal, setAuthModal] = useState(null);
  // function to call after successful login/register
  const [pendingAction, setPendingAction] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await r.json();
        if (data.user) setCurrentUser(data.user);
      } catch {}
      setAuthReady(true);
    })();
  }, []);

  const handleLogin = user => {
    setCurrentUser(user);
    setAuthModal(null);
    if (pendingAction) {
      pendingAction(user);
      setPendingAction(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setCurrentUser(null);
    navigate('/');
  };

  // Calls action immediately if logged in; otherwise opens login modal first.
  const requireLogin = action => {
    if (currentUser) {
      action(currentUser);
    } else {
      setPendingAction(() => action);
      setAuthModal('login');
    }
  };

  const closeAuthModal = () => {
    setAuthModal(null);
    setPendingAction(null);
  };

  if (!authReady) return <div className="loading">Loading…</div>;

  return (
    <div className="app">
      <Header
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLoginClick={() => setAuthModal('login')}
        onRegisterClick={() => setAuthModal('register')}
        onLogout={handleLogout}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<CinemaList />} />
          <Route path="/cinema/:cinemaId" element={<WeekSchedule />} />
          <Route
            path="/schedule/:scheduleId"
            element={<SeatMap currentUser={currentUser} requireLogin={requireLogin} />}
          />
          <Route
            path="/my-reservations"
            element={<MyReservations currentUser={currentUser} requireLogin={requireLogin} />}
          />
        </Routes>
      </main>

      {authModal === 'login' && (
        <LoginModal
          onLogin={handleLogin}
          onClose={closeAuthModal}
          onSwitchToRegister={() => setAuthModal('register')}
        />
      )}
      {authModal === 'register' && (
        <RegisterModal
          onLogin={handleLogin}
          onClose={closeAuthModal}
          onSwitchToLogin={() => setAuthModal('login')}
        />
      )}
    </div>
  );
}

export default App;
