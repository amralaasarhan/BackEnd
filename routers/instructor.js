const express = require('express');
const instructorControllers = require("../controllers/instructor");
const middleware = require("../middleware/auth");

const instructorRouters = express.Router();

//Available tracks
instructorRouters.get('/instructors', instructorControllers.getInstructors);
instructorRouters.post('/add',instructorControllers.addInstructor )
instructorRouters.get('/track', instructorControllers.getTrackByName);


module.exports = instructorRouters;