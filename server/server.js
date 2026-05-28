const express = require("express");

const dotenv = require("dotenv");

const cors = require("cors");

const http = require("http");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const discussionRoutes = require(
  "./routes/discussionRoutes"
);


// ==============================
// CONFIG
// ==============================

dotenv.config();

connectDB();


// ==============================
// APP
// ==============================

const app = express();

const server =
  http.createServer(app);


// ==============================
// SOCKET.IO
// ==============================

const io = new Server(server, {

  cors: {

    origin:
      "http://localhost:5173",

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],

  },

});


// ==============================
// MIDDLEWARE
// ==============================

app.use(cors());

app.use(express.json());


// ==============================
// ROUTES
// ==============================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/discussions",
  discussionRoutes
);


// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {

  res.json({

    message:
      "Backend Running Successfully",

  });

});


// ==============================
// REAL-TIME FEATURES
// ==============================

let onlineUsers = [];

io.on(
  "connection",
  (socket) => {

    console.log(
      "User Connected:",
      socket.id
    );


    // ==========================
    // JOIN USER
    // ==========================

    socket.on(
      "joinUser",
      (username) => {

        const userExists =
          onlineUsers.find(
            (user) =>
              user.socketId ===
              socket.id
          );

        if (!userExists) {

          onlineUsers.push({

            username,

            socketId:
              socket.id,

          });

        }

        io.emit(
          "onlineUsers",
          onlineUsers
        );

      }
    );


    // ==========================
    // SEND MESSAGE
    // ==========================

    socket.on(
      "sendMessage",
      (messageData) => {

        io.emit(
          "receiveMessage",
          messageData
        );

      }
    );


    // ==========================
    // TYPING INDICATOR
    // ==========================

    socket.on(
      "typing",
      (username) => {

        socket.broadcast.emit(
          "typing",
          `${username} is typing...`
        );

      }
    );


    // ==========================
    // STOP TYPING
    // ==========================

    socket.on(
      "stopTyping",
      () => {

        socket.broadcast.emit(
          "typing",
          ""
        );

      }
    );


    // ==========================
    // DISCONNECT
    // ==========================

    socket.on(
      "disconnect",
      () => {

        onlineUsers =
          onlineUsers.filter(
            (user) =>
              user.socketId !==
              socket.id
          );

        io.emit(
          "onlineUsers",
          onlineUsers
        );

        console.log(
          "User Disconnected"
        );

      }
    );

  }
);


// ==============================
// PORT
// ==============================

const PORT =
  process.env.PORT || 5000;


// ==============================
// SERVER START
// ==============================

server.listen(PORT, () => {

  console.log(
    `Server Running On Port ${PORT}`
  );

});