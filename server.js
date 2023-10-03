const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})

// Menyajikan halaman HTML sederhana
app.get("/", (req, res) => {
  res.json({
    status: "Running",
  });
});

// Mengelola koneksi socket.io
io.on("connection", (socket) => {
  console.log("connected");
  socket.on("disconnect", function () {
    console.log("disconnected");
  });

  socket.on("send_from_arduino", (data) => {
    console.log(data);
    io.emit("to_client", data);
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
