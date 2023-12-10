import {useState, useEffect} from 'react';
import RoomColumn from './RoomColumn';

function Board() {
  const [rooms, setRooms] = useState([]);
  const loadRooms = async () => {
    const response = await fetch ('/models/rooms');
    if (response.status === 200) {
      setRooms(await response.json());
    }
  };
  useEffect(() => {loadRooms();}, []);
  return (
  <div className="container">
    {
      rooms.map((room, index) => <RoomColumn key={index} room={room} index={index} width={100 / rooms.length - 1} />)
    }
  </div>
  )
}

export default Board;
