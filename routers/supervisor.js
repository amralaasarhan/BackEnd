const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const supervisorControllers = require("../controllers/supervisor");
const middleware = require("../middleware/auth");
const supervisorRouters = express.Router();


/////////////////////////////--Track and Track Ilo and Track Image--/////////////////////////////////////////////////
//Add Track with its image
supervisorRouters.post("/addTrack", middleware.verifyToken, upload.single('trackImage'), supervisorControllers.addTrack);

// View Track with its Image
supervisorRouters.get('/viewTracks', supervisorControllers.viewTracks);

//editTrack with its Image 
supervisorRouters.put(`/editTrack/:trackTitle`, middleware.verifyToken, upload.single('trackImage'), supervisorControllers.updateTrack)

//deleteTrack
supervisorRouters.delete('/deleteTrack/:trackTitle', middleware.verifyToken, supervisorControllers.deleteTrack)


/////////////////////////////--TrackImage--/////////////////////////////////////////////////
/*
//Add Track Image

supervisorRouters.post('/addTrackImage/:trackTitle', middleware.verifyToken, upload.single('trackImage'), supervisorControllers.addTrackImage)
supervisorRouters.get('/addTrackImage', middleware.verifyToken, supervisorControllers.renderUploadForm);

//update Track Image
supervisorRouters.put('/updateTrackImage', middleware.verifyToken, upload.single('trackImage'), supervisorControllers.updateTrackImage)
supervisorRouters.get('/updateTrackImage', middleware.verifyToken, supervisorControllers.renderUploadForm);

//Delete Track Image
//supervisorRouters.delete('/deleteTrackImage', middleware.verifyToken, supervisorControllers.deleteTrackImage)

//view Image
supervisorRouters.get('/displayTrackImage', supervisorControllers.displayTrackImage);
*/

/////////////////////////////--TrackIlo--/////////////////////////////////////////////////
//Add TrackIlo
supervisorRouters.post("/addTrackIlo", middleware.verifyToken, supervisorControllers.addTrackIlo);

//Update TrackIlo
supervisorRouters.put("/updateTrackIlo/:trackIloId", middleware.verifyToken, supervisorControllers.updateTrackIlo);

//Delete TrackIlo
supervisorRouters.delete("/deleteTrackIlo/:trackIloId", middleware.verifyToken, supervisorControllers.deleteTrackIlo);

// get Track Ilo
supervisorRouters.get("/getTrackIlo/:trackId", middleware.verifyToken, supervisorControllers.getTrackIlo);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////--Courses--/////////////////////////////////////////////////
//Add course to a track
supervisorRouters.get('/getExistingCourses', middleware.verifyToken, supervisorControllers.getExistingCourses);
supervisorRouters.post('/addCourseToTrack', middleware.verifyToken, upload.single('courseImage'), supervisorControllers.addCourseToTrack);


//Link course to trackIlo
supervisorRouters.post('/linkCourseToTrackILO', middleware.verifyToken, supervisorControllers.linkCourseToTrackILO);
//Get course with wegiht and trackilo
supervisorRouters.get('/getTrackILOForThisCourse/:courseId', middleware.verifyToken, supervisorControllers.getAllTrackILOConnectedWithThisCourse);
//Get courses and trackilo
supervisorRouters.get('/getCourseForThisTrackILO/:trackIloId', middleware.verifyToken, supervisorControllers.getCoursesConnectedWithThisTrackILO);


//Get course with wegiht and trackilo
supervisorRouters.post('/AddcourseWeightToTrackILo/:trackIloId', middleware.verifyToken, supervisorControllers.AddcourseWeightToTrackILo);


//Get course with wegiht and trackilo
supervisorRouters.post('/AddcourseILoWight/:courseIloIld', middleware.verifyToken, supervisorControllers.AddcourseILoWight);

///////////////////////////////

// Edit Course
supervisorRouters.put(`/editCourse/:courseName`, middleware.verifyToken, upload.single('courseImage'), supervisorControllers.updateCourse);

// Delete Course
supervisorRouters.delete('/deleteCourse/:courseId', middleware.verifyToken, supervisorControllers.deleteCourse);

// View Course of the Supervisor
supervisorRouters.get('/viewCourses', middleware.verifyToken, supervisorControllers.viewCourses);

//View Courses in a track
supervisorRouters.get('/viewCoursesInTrack/:trackId', supervisorControllers.viewCoursesInTrack);


/////////////////////////////--CourseIlo--/////////////////////////////////////////////////
//Add CourseIlo
supervisorRouters.post("/addCourseIlo", middleware.verifyToken, supervisorControllers.addCourseIlo);

//Update CourseIlo
supervisorRouters.put("/updateCourseIlo/:courseIloId", middleware.verifyToken, supervisorControllers.updateCourseIlo);

//Delete CourseIlo
supervisorRouters.delete("/deleteCourseIlo/:courseIloId", middleware.verifyToken, supervisorControllers.deleteCourseIlo);

// get CourseIlo
supervisorRouters.get("/getCourseIlo/:courseId", middleware.verifyToken, supervisorControllers.getCourseIlo);

/////////////////////////////--Course Topic--/////////////////////////////////////////////////
//Add Course Topic
supervisorRouters.post('/addCourseTopic', middleware.verifyToken, upload.single('courseFile'), supervisorControllers.addCourseTopic);

//get  Course Topic
supervisorRouters.get('/getCourseTopics/:courseId', middleware.verifyToken, supervisorControllers.getCourseTopics);

//update Course Topic
supervisorRouters.put("/updateCourseTopic/:courseTopicId", middleware.verifyToken, upload.single('courseFile'), supervisorControllers.updateCourseTopic);

//delete Course Topic
supervisorRouters.delete("/deleteCourseTopic/:courseTopicId", middleware.verifyToken, supervisorControllers.deleteCourseTopic);




/////////////////////////////--Survey--/////////////////////////////////////////////////

//create Survey
supervisorRouters.post("/createSurvey", supervisorControllers.addSurvey)

//Add survey questions
supervisorRouters.post("/addSurveyQuestion/:surveyID", supervisorControllers.addSurveyQuestions)




/////////////////////////////--Assesment--/////////////////////////////////////////////////
//Add Assesment
supervisorRouters.post("/addAssesment", supervisorControllers.addAssesment);

//Add Assesment Question
supervisorRouters.post("/addAssesmentQuestion", supervisorControllers.addAssesmentQuestion);

//Add Answer
supervisorRouters.post("/addAnswer", supervisorControllers.addAnswer);

//add Assesment Question And CourseTopic
supervisorRouters.post("/addAssesmentQuestionAndCourseTopic", supervisorControllers.addAssesmentQuestionAndCourseTopic);

// Route for uploading assessment files
supervisorRouters.post("/uploadAssessmentFile", upload.single('file'), supervisorControllers.uploadAssessmentFile);

//Delete Assesment
supervisorRouters.delete("/deleteAssesment/:assesmentId", supervisorControllers.deleteAssesment);

//Delete Assesment Question
supervisorRouters.delete("/deleteAssesmentQuestion", supervisorControllers.deleteAssesmentQuestion);

//Delete Answer
supervisorRouters.delete("/deleteAnswer", supervisorControllers.deleteAnswer);

//Get Assessments
supervisorRouters.get("/getAssessments", supervisorControllers.getAssessments);

//Get Assessment By courseiloid
supervisorRouters.get("/getAssesmentsByCourseIloId/:courseIloId", supervisorControllers.getAssessmentByCourseIloId);

//Get Assessment Questions
supervisorRouters.get("/getAssessmentQuestions", supervisorControllers.getAssessmentQuestions);

//Get Assessment Questions By AssessmentId
supervisorRouters.get("/getAssessmentQuestionsByAssessmentId/:assesmentId", supervisorControllers.getAssessmentQuestionsByAssessmentId)

//Get Assessment Questions By QuestionId
supervisorRouters.get("/getAnswerByAssessmentQuestionsId/:assesmentQuestionId", supervisorControllers.getAnswerByAssessmentQuestionId)



//Amr code new 

supervisorRouters.get("/getSubmissions/:courseTopicID",supervisorControllers.getSubmissionsForCourseTopic);
supervisorRouters.put("/gradeSubmission/:submissionID",supervisorControllers.gradeSubmission);

///testing
supervisorRouters.post("/createAss/:courseID",middleware.verifyToken,upload.single("file"),supervisorControllers.createAssessment);

supervisorRouters.get("/courseAssessments/:courseID",supervisorControllers.getAllAssessments);
supervisorRouters.get("/assessment/:assessmentID",supervisorControllers.getAssessment);
supervisorRouters.get("/ungraded-attempts/:courseID", supervisorControllers.getUngradedAttempts);
supervisorRouters.get("/ungraded-essay-questions/:attemptID", supervisorControllers.getEssayQuestionsForAssessment);
supervisorRouters.put("/update-student-grades", supervisorControllers.gradeStudentsEssays);









supervisorRouters.get("/getInstructorID/:courseID", supervisorControllers.getInstructorIdForCourse)
supervisorRouters.get("/feedbackAnalysis/:surveyID" , supervisorControllers.sentimentAnalysis)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = supervisorRouters;