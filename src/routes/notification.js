const route = require("express").Router();
const controller = require("../controller/notification");

route.get("/",controller.getMyNotifications);


module.exports = route;