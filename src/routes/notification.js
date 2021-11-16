const route = require("express").Router();
const controller = require("../controller/notification");

route.get("/",controller.getMyNotifications);
route.get('/check',controller.sendByApi)

module.exports = route;