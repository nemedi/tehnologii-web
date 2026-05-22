const { WebSocketServer } = require('ws');

const rooms = new Map();

function setup(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', ws => {
    let subscribedId = null;

    ws.on('message', raw => {
      try {
        const { type, scheduleId } = JSON.parse(raw);
        if (type === 'subscribe' && scheduleId) {
          subscribedId = String(scheduleId);
          if (!rooms.has(subscribedId)) rooms.set(subscribedId, new Set());
          rooms.get(subscribedId).add(ws);
        }
      } catch {}
    });

    ws.on('close', () => {
      if (subscribedId) {
        const room = rooms.get(subscribedId);
        if (room) {
          room.delete(ws);
          if (room.size === 0) rooms.delete(subscribedId);
        }
      }
    });

    ws.on('error', () => {});
  });
}

function broadcastSeatsUpdate(scheduleId) {
  const room = rooms.get(String(scheduleId));
  if (!room) return;
  const msg = JSON.stringify({ type: 'seats_updated', scheduleId: String(scheduleId) });
  for (const client of room) {
    if (client.readyState === 1) client.send(msg);
  }
}

module.exports = { setup, broadcastSeatsUpdate };
