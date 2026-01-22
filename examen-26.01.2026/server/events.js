
import { getWss } from "./server.js";

function broadcastReserveEvent(scheduleId, seatRow, seatColumn, userId) {
  const wss = getWss();
  wss.clients.filter(ws => ws.scheduleId === scheduleId)
    .forEach(ws => {
        const owner = ws.userId === userId ? "yours" : "others";
        ws.send(JSON.stringify({
        type: "RESERVE",
        seatRow,
        seatColumn,
        owner
    }));
  });
}

function broadcastReleaseEvent(scheduleId, seatRow, seatColumn) {
  const wss = getWss();
  wss.clients.filter(ws => ws.scheduleId === scheduleId)
    .forEach(ws => {
        ws.send(JSON.stringify({
        type: "RELEASE",
        seatRow,
        seatColumn
    }));
  });
}

export default {
    broadcastReserveEvent,
    broadcastReleaseEvent
}