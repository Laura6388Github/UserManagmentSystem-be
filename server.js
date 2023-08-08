require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const socketio = require("socket.io");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const { adminBro, adminRoute } = require("./config/adminBro");

const app = express();
const server = require("http").Server(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

connectDB();

var corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
};

app.use(adminBro.options.rootPath, adminRoute);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false, // add this line to define the resave option
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res, next) => {
  res.send("UMS api running!");
});

// Connecting Routes

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));

//////////////
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/income", require("./routes/income"));
app.use("/api/project", require("./routes/project"))
app.use("/api/expense", require("./routes/expense"));
app.use("/api/potential", require("./routes/potential"));
app.use("/api/skill", require("./routes/skill"));
app.use("/api/constants", require("./routes/constants"));
app.use("/api/account", require("./routes/account"));
app.use("/api/report", require("./routes/report"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Sever running on port ${PORT}`));

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

process.on("unhandledRejection", (err, promise) => {
  console.log(err)
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
