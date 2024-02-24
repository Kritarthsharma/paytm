const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const accountRouter = require("./routes/accountRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/account", accountRouter);

module.exports = app;
