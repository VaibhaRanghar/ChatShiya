const express = require("express");
const {
  createMessages,
  getMessages,
} = require("../Controllers/messageControllers");

const router = express.Router();

router.post("/", createMessages);

router.get("/:chatId", getMessages);

module.exports = router;