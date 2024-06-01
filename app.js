require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const cors = require("cors");

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4200", // Specify the origin of the client
    credentials: true,
  })
); // Specify allowed headers
const userRouter = require("./routers/user");
app.use("/project", userRouter);

const studentRouters = require("./routers/student");
app.use("/project/student", studentRouters);

const instructorRouters = require("./routers/instructor");
app.use("/project/instructor", instructorRouters);

const supervisorRouters = require("./routers/supervisor");
app.use("/project/supervisor", supervisorRouters);

const adminRouters = require("./routers/admin");
app.use("/project/admin", adminRouters);

const expertRouters = require("./routers/expert");
app.use("/project/expert", expertRouters);

module.exports = app;
