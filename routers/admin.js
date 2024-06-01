const express = require('express');
const adminControllers = require("../controllers/admin");
const middleware = require("../middleware/auth");

const adminRouters = express.Router();

adminRouters.post('/block',adminControllers.blockUser);
adminRouters.get('/usernames',adminControllers.getAllUsernames);

module.exports = adminRouters;