import React, {useContext, useState} from 'react';
import { WebSocketContext } from './context';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, send } from './actions';
import { LOGIN, LOGOUT, CHAT } from './constants';

function Application() {
  const context = useContext(WebSocketContext);
  const user = useSelector(state => state.user);
  const messages = useSelector(state => state.messages);
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  function setUser() {
    if (user) {
      dispatch(logout(context));
    } else {
      dispatch(login(context, name));
    }
  }
  function sendMessage(event) {
    if (event.key === 'Enter' && event.target.value.trim().length > 0) {
      dispatch(send(context, event.target.value.trim()));
      event.target.value = '';
    }
  }
  return (
    <div className="container">
      <form>
        <label>User Name</label>
        <input value={name}
          readOnly={user !== undefined}
          onChange={event => setName(event.target.value.trim())}/>
        <input type="button"
          value={user === undefined ? 'Login' : 'Logout'}
          onClick={setUser}/>
        <label>Message</label>
        <input onKeyUp={sendMessage}
          readOnly={user === undefined}/>
        <div className='messages'>
          {
            messages.map(({type, payload}, index) => {
              switch (type) {
                case LOGIN:
                  return (
                    <div key={index} className="admin">
                      User <b>{payload}</b> has entered the chat.
                    </div>
                  );
                  case LOGOUT:
                    return (
                      <div key={index} className="admin">
                        User <b>{payload}</b> has left the chat.
                      </div>
                    );
                    case CHAT:
                      return (
                        <div key={index}
                          className={payload.from === user ? 'me' : 'other'}>
                          <b>{payload.from}:</b> {payload.text}
                        </div>
                      );
                    default:
                      return (
                        <div key={index}>
                          `Unknown message type: ${type}.`
                        </div>
                      );
              }
            })
          }
        </div>
      </form>
    </div>
  );
}

export default Application;
