import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ currentUser, theme, onToggleTheme, onLoginClick, onRegisterClick, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <span className="header-logo" onClick={() => navigate('/')}>
        &#127910; CineBook
      </span>
      <nav className="header-nav">
        <button className="btn btn-theme" onClick={onToggleTheme}>
          {theme === 'dark' ? '☀ Light Mode' : '☾ Dark Mode'}
        </button>
        {currentUser ? (
          <>
            <span className="header-user">
              Welcome, <strong>{currentUser.username}</strong>
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/my-reservations')}
            >
              My Reservations
            </button>
            <button className="btn btn-secondary" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={onRegisterClick}>
              Register
            </button>
            <button className="btn btn-primary" onClick={onLoginClick}>
              Login
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
