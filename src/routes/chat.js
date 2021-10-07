const route = require("express").Router();
const controller = require("../controller/chat");

route.get("/",controller.getChatRooms);
route.get("/message",controller.getChats);
route.get("/message/group",controller.getGroupChats);

module.exports = route;