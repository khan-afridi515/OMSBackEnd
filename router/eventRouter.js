const express = require("express");
const { eventFunction, updateEvent, getAllEvents, deleteEvent, registerForEvent } = require("../control/event");
const { authorization } = require("../auth");
const myEventRouter = express.Router();




myEventRouter.post("/event", authorization, eventFunction);
myEventRouter.put("/updateEvent/:eventId", authorization, updateEvent);
myEventRouter.get("/getEvents", getAllEvents);
myEventRouter.delete("/dltEvent/:eventId", authorization, deleteEvent);
myEventRouter.post("/registerEvnt/:eventId", authorization, registerForEvent);

module.exports = myEventRouter;