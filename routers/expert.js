 const express = require('express');
 const expertControllers = require("../controllers/expert");
const middleware = require("../middleware/auth");

 const expertRouters = express.Router();

 expertRouters.get('/getNames',expertControllers.getAllExpertsNames)

 expertRouters.post('/sendMsg',expertControllers.sendMessage)

 module.exports = expertRouters;