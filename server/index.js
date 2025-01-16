const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./Routes/userRoute");
const chatRouter = require("./Routes/chatRoute");
const messageRouter = require("./Routes/messageRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

//ROUTES.
app.get("/", (req, res) => {
  res.send("Welcome to ChatShia!");
});
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

const port = process.env.PORT || 5001;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log("Server on PORT " + port);
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connection established!");
  })
  .catch((err) => {
    console.log("Error on MongoDB connection: ", err.message);
  });
