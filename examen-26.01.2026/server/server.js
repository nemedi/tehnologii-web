import express from "express";
import expressWs from "express-ws";
import router from "./api.js";
import repository from "./repository.js";

const baseAplication = express();
const websocket = expressWs(baseAplication);
const application = websocket.app;
const getWss = websocket.getWss;

application.use(express.json());
application.use("/api", router);

application.ws("/events", (ws, request) => {
  console.log("WebSocket client connected");
  ws.userId = null;
  ws.scheduleId = null;
  ws.on("message", async (data) => {
    try {
      const message = JSON.parse(data);
      if (message.type === "LOGIN") {
        const { email, password } = message;
        if (!email || !password) {
          return ws.send(JSON.stringify({
            type: "LOGIN_RESULT",
            success: false,
            error: "Email and password are required."
          }));
        }
        try {
          const userId = await repository.login(email, password);
          ws.userId = userId;
          ws.scheduleId = message.scheduleId;
          ws.send(JSON.stringify({
            type: "LOGIN_RESULT",
            success: true,
            userId
          }));
        } catch (error) {
          ws.send(JSON.stringify({
            type: "LOGIN_RESULT",
            success: false,
            error: error.message
          }));
        }
      }
    } catch (error) {
      console.error("Invalid WS message:", error);
      ws.send(JSON.stringify({
        type: "ERROR",
        message: "Invalid JSON payload."
      }));
    }
  });
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

async function startServer() {
  await repository.initializeDatabase();
  const PORT = 3000;
  application.listen(PORT, () => {
    console.log(`HTTP API running at: http://localhost:${PORT}/api`);
    console.log(`WebSocket server running at: ws://localhost:${PORT}/events`);
  });
}

startServer();

export { getWss };
