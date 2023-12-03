import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Routes, Route } from "react-router-dom";
import Table from './Table';
import Form from './Form';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Table />} />
      <Route path="/add" element={<Form />} />
      <Route path="/edit/:noteId" element={<Form />} />
    </Routes>
  </HashRouter>
);
