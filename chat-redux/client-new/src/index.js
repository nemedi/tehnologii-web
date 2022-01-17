import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Application from './application';
import WebSocketContext from './context';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
      <WebSocketContext>
        <Application />
      </WebSocketContext>
  </Provider>,
  document.getElementById('root')
);