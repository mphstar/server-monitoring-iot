const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  allowRequest: (req, callback) => {
    const noOriginHeader = req.headers.origin === undefined;
    callback(null, noOriginHeader);
  },
});

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
