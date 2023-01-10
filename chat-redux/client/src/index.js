import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import store from './store';
import Application from './application';
import WebSocketContext from './context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <WebSocketContext>
      <Application />
    </WebSocketContext>
  </Provider>
);