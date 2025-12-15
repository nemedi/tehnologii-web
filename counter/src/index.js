import React from 'react';
import ReactDOM from 'react-dom/client';
import Counter from './Counter';
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Counter value="1" />
);
