import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { Server } from "socket.io";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/recordings", express.static("uploads/recordings"));
app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);
const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
const io = new Server(server, {
  //socket from io library
  cors: {
    origin: "http://localhost:3000",
  },
});
global.onlineUsers = new Map(); //map data structure
io.on("connection", (socket) => {
  //event with socket call back function
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    //another event
    global.onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(global.onlineUsers.keys()),
    });
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", {
        from: data.from,
        message: data.message,
      });
    }
  });
  socket.on("outgoing-video-call", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("income-video-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });

  socket.on("outgoing-voice-call", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("income-voice-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });
  socket.on("rejected-video-call", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("video-call-rejected");
    }
  });
  socket.on("rejected-voice-call", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("voice-call-rejected");
    }
  });

  socket.on("answer-income-call", ({ id }) => {
    const sendUserSocket = global.onlineUsers.get(id);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("answer-call");
    }
  });
  socket.on("signout", (id) => {
    global.onlineUsers.delete(id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(global.onlineUsers.keys()),
    });
  });
});
