const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const middleware = require("../middleware/auth");
const userController = require('../controllers/user')
const userRouter = express.Router();

//Signup
userRouter.post('/signup', userController.signup)

//Login
userRouter.get('/login', userController.renderLoginForm);
userRouter.post('/login', userController.login)

//Reset Password
userRouter.post('/send-reset-email', userController.sendResetLink)
userRouter.post('/reset-password', userController.resetPassword)


// Messages
userRouter.get('/sent-messages', middleware.verifyToken, userController.getSentMessages);
userRouter.get('/received-messages', middleware.verifyToken, userController.getReceivedMessages);
userRouter.post('/messages', middleware.verifyToken, userController.sendMessage);

//UpdateProfile
userRouter.put('/updateProfile', middleware.verifyToken, userController.updateProfile);

//Delete User
userRouter.delete('/deleteUser', middleware.verifyToken, userController.deleteUser);

//Search Courses By Name
userRouter.get('/searchCourse', userController.searchCoursesByName);
userRouter.get('/searchTrack', userController.searchTrackByName);


//Available tracks
userRouter.get('/tracks', userController.getAvailableTracks);

//Get All Courses
userRouter.get('/getCourses', userController.getCourses)

//Upload Profile Pictures
userRouter.post('/uploadImage', middleware.verifyToken, upload.single('profilePicture'), userController.uploadProfilePicture)
userRouter.get('/uploadImage', middleware.verifyToken, userController.renderUploadForm);

// userRouter.get('/displayProfilePicture', middleware.verifyToken, userController.displayProfilePicture);

module.exports = userRouter;