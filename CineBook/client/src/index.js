import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './App.css';
import App from './App';

// Apply saved theme before first paint to avoid flash
document.body.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
