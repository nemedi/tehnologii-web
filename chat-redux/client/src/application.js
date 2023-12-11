import React, {useContext, useState} from 'react';
import {WebSocketContext} from './context';
import {useSelector, useDispatch} from 'react-redux';
import {join, exit, send} from './actions';
import {JOIN, EXIT, CHAT} from './constants';

function Application() {
  const context = useContext(WebSocketContext);
  const user = useSelector(state => state.user);
  const messages = useSelector(state => state.messages);
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  function setUser() {
    if (user) {
      dispatch(exit(context));
    } else {
      dispatch(join(context, name));
    }
  }
  function sendMessage(event) {
    if (event.key === 'Enter' && event.target.value.trim().length > 0) {
      dispatch(send(context, event.target.value.trim()));
      event.target.value = '';
    }
  }
  function renderMessage(message, index) {
    switch (message.type) {
      case JOIN:
        return (
          <div key={index} className="admin text">
            User <b>{message.user}</b> has entered the chat.
          </div>
        );
        case EXIT:
          return (
            <div key={index} className="admin text">
              User <b>{message.user}</b> has left the chat.
            </div>
          );
          case CHAT:
            return (
              <div key={index}
                className={message.from === user ? 'me text' : 'other text'}>
                <b>{message.from}:</b> {message.text}
              </div>
            );
          default:
            return (
              <div key={index}>
                `Unknown message type: ${message.type}.`
              </div>
            );
    }
  }
  return (
    <div className="container">
      <form>
        <label>Name</label>
        <input value={name}
          readOnly={user !== undefined}
          onChange={event => setName(event.target.value.trim())}/>
        <input type="button"
          value={user === undefined ? 'Join' : 'Exit'}
          onClick={setUser}/>
        {user && (<label>Message</label>)}
        {user && (<input onKeyUp={sendMessage} readOnly={user === undefined}/>)}
        {user && (
          <div className="messages">
          {
            messages.map((message, index) => renderMessage(message, index))
          }
          </div>
        )}
      </form>
    </div>
  );
}
export default Application;
