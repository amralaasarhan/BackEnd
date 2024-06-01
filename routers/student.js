const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      (file.mimetype === "application/msword",
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      file.mimetype === "application/epub+zip",
      file.mimetype === "application/vnd.google-apps.document",
      file.mimetype === "application/vnd.oasis.opendocument.text",
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.template.wordprocessingml.template",
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
      file.mimetype === "application/vnd.ms-word.document.macroEnabled.12",
      file.mimetype === "application/pdf" ||
        file.mimetype === "application/rtf")
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(
          "Invalid file type. Only .doc, .docx, .epub, .gdoc, .odt, .ott, .oth, .pdf, .rtf files are allowed."
        )
      );
    }
  },
});

const studentControllers = require("../controllers/student");
const middleware = require("../middleware/auth");

const studentRouters = express.Router();

studentRouters.post(
  "/portfolio",
  middleware.verifyToken,
  studentControllers.addPortfolio
);

studentRouters.put(
  "/editPortfolio",
  middleware.verifyToken,
  studentControllers.editPortfolio
);

studentRouters.delete(
  "/deletePortfolio",
  middleware.verifyToken,
  studentControllers.deletePortfolio
);

//Contact superviosr
studentRouters.post("/sendmsg", studentControllers.sendMessage);
studentRouters.get("/sup/:trackTitle", studentControllers.getSupervisorName);

//get registered Tracks
studentRouters.get(
  "/getRegisteredTracks",
  middleware.verifyToken,
  studentControllers.registeredTracks
);

//get registered Courses
studentRouters.get(
  "/registeredCourses",
  middleware.verifyToken,
  studentControllers.getRegisteredCourses
);

studentRouters.post(
  "/addSub",
  upload.single("file"),
  middleware.verifyToken,
  studentControllers.addSubmission
);
// studentRouters.get("/addo", studentControllers.renderAdd)

studentRouters.post("/id", studentControllers.getSubmissionIdByFileName);

studentRouters.delete(
  "/deleteSubmission/:submissionId",
  studentControllers.deleteSubmission
);

studentRouters.put(
  "/editSubmissionName",
  studentControllers.editSubmissionName
);

studentRouters.get(
  "/submissionMongoId/:fileName",
  studentControllers.getMongoIdByFileName
);

studentRouters.put(
  "/updateSubmission/:MongoID/:submissionId",
  upload.single("file"),
  middleware.verifyToken,
  studentControllers.updateSubmission
);

studentRouters.get(
  "/getPreviousSubmissionID/:courseTopicID",
  middleware.verifyToken,
  studentControllers.getPreviousSubmissionID
);
studentRouters.get("/surveyID/:type/:id", studentControllers.getSurveyID);
studentRouters.post("/surveyIDs", studentControllers.getSurveysIDs);
studentRouters.get("/getSurvey/:type/:id", studentControllers.getSurvey);
studentRouters.get("/getSurveyByID/:surveyID", studentControllers.getSurvey);
studentRouters.post(
  "/submitSurveyFeedback/:surveyID",
  middleware.verifyToken,
  studentControllers.submitSurveyAnswers
);
studentRouters.get(
  "/participants/:trackID/:courseID",
  studentControllers.getParticipants
); //track id is static in angular
studentRouters.get(
  "/super-uname/:supervisorID",
  studentControllers.getSupervisorUserNameByID
);
studentRouters.get(
  "/courseAssessments/:courseID",
  studentControllers.getAllAssessments
);
studentRouters.get(
  "/assessment/:assessmentID",
  studentControllers.getAssessment
);
studentRouters.post(
  "/submit-answers",
  middleware.verifyToken,
  studentControllers.submitAnswers
);
studentRouters.get(
  "/grades/:courseID",
  middleware.verifyToken,
  studentControllers.getGrades
);

studentRouters.get(
  "/skip-placement-test/:trackID",
  middleware.verifyToken,
  studentControllers.skipPlacementTest
);
studentRouters.post(
  "/register-placement-tests/:trackID",
  middleware.verifyToken,
  studentControllers.registerPlacementTests
);
studentRouters.get(
  "/track-placement-tests/:trackID",
  middleware.verifyToken,
  studentControllers.getPlacementTests
);

//progress
studentRouters.get(
  "/getProgress/:courseID",middleware.verifyToken,
  studentControllers.calculateCourseProgress
);

studentRouters.get("/getSurveyInstructorID/:courseID/:instructorID", middleware.verifyToken, studentControllers.getInstructorSurveyIdForCourse)

module.exports = studentRouters;
