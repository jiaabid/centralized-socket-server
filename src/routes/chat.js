const route = require("express").Router();
const controller = require("../controller/chat");

route.get("/",controller.getChatRooms);

module.exports = route;