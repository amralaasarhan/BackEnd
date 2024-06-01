//User Model
const { default: User } = require("../models/UserModel/User");
const {
  default: UserSQLServerDB,
} = require("../models/UserModel/UserSQLServerDB");
const userSQLServerDB = new UserSQLServerDB();

//Supervisor Model
const { default: Student } = require("../models/StudentModel/Student");
const {
  default: StudentSQLServerDB,
} = require("../models/StudentModel/StudentSQLServerDB");
const studentSQLServerDB = new StudentSQLServerDB();
const {
  default: StudentMongoDB,
} = require("../models/StudentModel/StudentMongoDB");
const studentMongoDB = new StudentMongoDB();

//Supervisor Model
const { default: Supervisor } = require("../models/SupervisorModel/Supervisor");
const {
  default: SupervisorSQLServerDB,
} = require("../models/SupervisorModel/SupervisorSQLServerDB");
const supervisorSQLServerDB = new SupervisorSQLServerDB();
const {
  default: SupervisorMongoDB,
} = require("../models/SupervisorModel/SupervisorMongoDB");
const supervisorMongoDB = new SupervisorMongoDB();

//MessageModel
const { default: Message } = require("../models/MessageModel/Message");
const {
  default: MessageMongoDB,
} = require("../models/MessageModel/MessageMongoDB");
const {
  default: MessageSQLServerDB,
} = require("../models/MessageModel/MessageSQLServerDB");
const messageSQLServerDB = new MessageSQLServerDB();
const messageMongoDB = new MessageMongoDB();

//Track model
const { default: Track } = require("../models/TrackModel/Track");
const { default: TrackImage } = require("../models/TrackModel/TrackImage");
const {
  default: TrackSQLServerDB,
} = require("../models/TrackModel/TrackSQLServerDB");
const trackSQLServerDB = new TrackSQLServerDB();
const trackImageModel = new TrackImage();

//Track Ilo Model
const { default: TrackIlo } = require("../models/TrackIloModel/TrackIlo");
const {
  default: TrackIloSQLServerDB,
} = require("../models/TrackIloModel/TrackIloSQLServerDB");
const trackIloSQLServerDB = new TrackIloSQLServerDB();

//Course Model
const { default: Course } = require("../models/CourseModel/Course");
const { default: CourseImage } = require("../models/CourseModel/CourseImage");
const {
  default: CourseSQLServerDB,
} = require("../models/CourseModel/CourseSQLServerDB");
const courseSQLServerDB = new CourseSQLServerDB();
const CourseImageModel = new CourseImage();

//Course Ilo Model
const { default: CourseIlo } = require("../models/CourseIloModel/CourseIlo");
const {
  default: CourseIloSQLServerDB,
} = require("../models/CourseIloModel/CourseIloSQLServerDB");
const courseIloSQLServerDB = new CourseIloSQLServerDB();

//Course Topic Model
const {
  default: CourseTopic,
} = require("../models/CourseTopicModel/CourseTopic");
const {
  default: CourseTopicMongoDB,
} = require("../models/CourseTopicModel/CourseTopicMongoDB");
const {
  default: CourseTopicSQLServerDB,
} = require("../models/CourseTopicModel/CourseTopicSQLServerDB");
const courseTopicSQLServerDB = new CourseTopicSQLServerDB();
const courseTopicMongoDB = new CourseTopicMongoDB();
//Survey Model

const { default: Survey } = require("../models/SurveyModel/Survey");
const {
  default: SurveyQuestion,
} = require("../models/SurveyModel/SurveyQuestion");
const {
  default: SurveySQLServerDB,
} = require("../models/SurveyModel/SurveySQLServerDB");
const {
  default: SurveyQuestionSQLServerDB,
} = require("../models/SurveyModel/SurveyQuestionSQLServerDB");
const surveyQuestionSQLServerDB = new SurveyQuestionSQLServerDB();
const surveySQLServerDB = new SurveySQLServerDB();

//Feedback Model
const { default: Feedback } = require("../models/FeedbackModel/Feedback");
const {
  default: FeedbackSQLServerDB,
} = require("../models/FeedbackModel/FeedbackSQLServerDB");
const {
  default: FeedbackAnswerSQLServerDB,
} = require("../models/FeedbackModel/FeedbackAnswerSQLServerDB");
const {
  default: FeedbackAnswer,
} = require("../models/FeedbackModel/FeedbackAnswer");
const feedbackSQLServerDB = new FeedbackSQLServerDB();
const feedbackAnswerSQLServerDB = new FeedbackAnswerSQLServerDB();
const {
  default: demoAssessmentSQLServerDB,
} = require("../models/AssesmentModel/demoAssessmentSQLServerDB");
const demoAss = new demoAssessmentSQLServerDB();
const {
  default: assessmentMongo,
} = require("../models/AssesmentModel/demoMongo");
const demoMongo = new assessmentMongo();

//Assesment Model
const { default: Assesment } = require("../models/AssesmentModel/Assesment");
const {
  default: AssesmentMongoDB,
} = require("../models/AssesmentModel/AssesmentMongoDB");
const {
  default: AssesmentSQLServerDB,
} = require("../models/AssesmentModel/AssesmentSQLServerDB");
const assesmentSQLServerDB = new AssesmentSQLServerDB();
const assessmentMongoDB = new AssesmentMongoDB();

//Portfolio Model
const { default: Portfolio } = require("../models/PortfolioModel/portfolio");
const {
  default: PortfolioSQLServerDB,
} = require("../models/PortfolioModel/PortfolioSQLServer");
const portfolioSQLServerDB = new PortfolioSQLServerDB();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { convertToObject } = require("typescript");

exports.addPortfolio = async (req, res) => {
  try {
    const userID = req.user.id;
    const studentID = await studentSQLServerDB.getStudentByID(userID);

    const EDUCATION_DEGREE = req.body.EDUCATION_DEGREE;
    const ACADEMIC_INSTITUTE = req.body.ACADEMIC_INSTITUTE;
    const TECHNICAL_SKILLS = req.body.TECHNICAL_SKILLS;
    const DESCRIPTION = req.body.DESCRIPTION;
    const EXPERIENCE = req.body.EXPERIENCE;
    const portfolio = new Portfolio(
      null,
      EDUCATION_DEGREE,
      ACADEMIC_INSTITUTE,
      TECHNICAL_SKILLS,
      DESCRIPTION,
      EXPERIENCE,
      studentID
    );
    const queryResult = await portfolioSQLServerDB.addPortfolio(portfolio);

    return res
      .status(200)
      .json({ message: "Portfolio Inserted", status: "ok" });
  } catch (error) {
    return res.status(500).json({ error: "Error in inserting portfolio" });
  }
};

exports.editPortfolio = async (request, response) => {
  // VERY PRONE TO SQL INJECTIONS use wit caution

  try {
    const userId = request.user.id; // GET USER ID FROM REQ.USER.ID
    const studentID = await studentSQLServerDB.getStudentByID(userId);
    console.log("Student ID=", studentID);
    const userDataToUpdate = {};
    const requestBody = request.body;

    // Iterate through all fields in the request body
    for (const field in requestBody) {
      // Only update fields that are not internal fields like "fields" or undefined fields
      if (requestBody.hasOwnProperty(field) && field !== "fields") {
        userDataToUpdate[field] = requestBody[field];
      }
    }

    console.log("This is what I want to update", userDataToUpdate);

    // Update user data in the database
    const queryResult = await portfolioSQLServerDB.updatePortfolio(
      { STUDENT_ID_FK: studentID },
      userDataToUpdate
    );

    // Retrieve updated user data

    // Return updated user data in the response
    return response
      .status(200)
      .json({ status: "OK", message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
exports.deletePortfolio = async (request, response) => {
  try {
    const userId = request.user.id; // GET USER ID FROM REQ.USER.ID
    const studentID = await studentSQLServerDB.getStudentByID(userId);
    console.log("Student ID=", studentID);
    const queryResult = await portfolioSQLServerDB.deletePortfolio(studentID);
    return response
      .status(200)
      .json({ message: "Portfolio deleted", status: "OK" });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

//////////////------------send Message------------////////////////////
exports.sendMessage = async (req, res) => {
  console.log("Send Method entered", req.body.email);

  const senderEmail = req.body.email;
  const sender = await userSQLServerDB.getUserByEmail(senderEmail);
  const recepientUsername = req.body.to;
  const recepient = await userSQLServerDB.getUserByUsername(recepientUsername);
  if (!recepient) {
    return response.status(404).json({
      status: "Error",
      message: "wrong recepient",
    });
  }
  const msgBody = req.body.msgBody;
  const msgSubject = req.body.msgTitle;
  const msgType = req.body.msgType;
  const senderID = sender[0];
  const time = new Date();
  const msg = new Message(
    sender[3],
    recepient[3],
    msgSubject,
    msgBody,
    msgType,
    time,
    senderID
  );
  const queryResult = await messageSQLServerDB.addMessage(msg);
  if (!queryResult)
    return res.status(500).json({ message: "Message Failed!", status: "BAD" });
  else return res.status(200).json({ message: "Message Sent!", status: "OK" });
};

//////////////------------get Supervisor Name------------////////////////////

exports.getSupervisorName = async (req, res) => {
  const { trackTitle } = req.params;
  try {
    const names = await supervisorSQLServerDB.getSupervisorName(trackTitle);

    // Ensure names is always an array
    const namesArray = Array.isArray(names) ? names : [names];

    // Handle the response as needed
    return res.json(namesArray);
  } catch (error) {
    console.error("Error in getTrackByName controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//view register Track
exports.registeredTracks = async (request, response) => {
  try {
    const userId = request.user.id; //student id from user table

    const tracks = await trackSQLServerDB.getRegisterdTracks(userId);

    for (let i = 0; i < tracks.length; i++) {
      const trackId = tracks[i].trackId;

      // Retrieve track image by trackId
      const trackImageQuery = await trackImageModel.getTrackImageByID(trackId);
      if (trackImageQuery !== null && trackImageQuery.image) {
        // Convert track image buffer to base64 string
        const base64TrackImage = Buffer.from(
          trackImageQuery.image.buffer
        ).toString("base64");
        tracks[i].trackImage = base64TrackImage;
      } else {
        // If track image not found, set track image to null
        tracks[i].trackImage = null;
      }

      // Retrieve all courses associated with the track
      const trackCourses = await courseSQLServerDB.getAllCoursesForTrack(
        trackId
      );
      let courses = [];
      // Loop through each course to fetch its details and image
      for (let j = 0; j < trackCourses.length; j++) {
        const courseId = trackCourses[j];
        // Retrieve course details by courseId
        const course = await courseSQLServerDB.getCourseById(courseId);
        // Retrieve course image by courseId
        const courseImageQuery = await CourseImageModel.getCourseImageByID(
          courseId
        );
        if (courseImageQuery !== null && courseImageQuery.image) {
          // Convert course image buffer to base64 string
          const base64CourseImage = Buffer.from(
            courseImageQuery.image.buffer
          ).toString("base64");
          course.courseImage = base64CourseImage;
        } else {
          // If course image not found, set course image to null
          course.courseImage = null;
        }
        courses.push(course);
      }
      tracks[i].courses = courses;
    }

    return response.status(200).json({ tracks });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ status: "Error", message: "Internal Server Error" });
  }
};

exports.getRegisteredCourses = async (request, response) => {
  try {
    const userId = request.user.id;

    // Fetch all courses ids for the track
    const coursesQuery = await courseSQLServerDB.getRegisteredCourses(userId);
    let courses = [];
    for (let i = 0; i < coursesQuery.length; i++) {
      const courseId = coursesQuery[i].courseId;

      const courseImageQuery = await CourseImageModel.getCourseImageByID(
        courseId
      );

      if (courseImageQuery !== null && courseImageQuery.image) {
        // Convert image buffer to base64 string
        const base64Image = Buffer.from(courseImageQuery.image.buffer).toString(
          "base64"
        );
        coursesQuery[i].courseImage = base64Image;
      } else {
        coursesQuery[i].courseImage = null;
      }
      courses[i] = coursesQuery[i];
    }

    return response.status(200).json({ courses });
  } catch (error) {
    console.error("Error:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addSubmission = async (req, res) => {
  try {
    const userId = req.user.id;
    const stdId = await studentSQLServerDB.getStudentByID(userId);
    const CourseTopicID = 1;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const fileType = req.file.mimetype;

    console.log("File Name:", fileName);
    console.log("File Size:", fileSize);
    console.log("File Type:", fileType);

    const file = req.file;

    console.log(file);

    // Call the method to add the submission
    const result = await submissionSQLServerDB.submission(
      fileName,
      fileType,
      stdId,
      CourseTopicID
    );
    const id = await submissionSQLServerDB.getSubmissionIdByFileName(fileName);

    const submission = new Submission(stdId, file, id);

    const queryResult = await submissionMongoDB.addSubmission(submission);

    // const mongoID= await submissionMongoDB.getSubmissionIdByFileName(fileName)
    // await this.getMongoIdByFileName(fileName);

    // Handle the response
    if (queryResult) {
      return res.status(201).json({ message: "Submission added successfully" });
    } else {
      return res
        .status(500)
        .json({ message: "Internal Server Error", queryResult });
    }
  } catch (error) {
    console.error("Error in adding submission:", error);
    return res.status(500).json({ error: "Error in adding submission" });
  }
};
exports.renderAdd = (req, res) => {
  console.log("Render Entered");
  res.render("add"); // Assuming your EJS files are in a "views" directory
};

exports.getSubmissionIdByFileName = async (req, res) => {
  try {
    const fileName = req.body.fileName; // Assuming the file name is passed as a route parameter

    // Call the method to get the submission ID by file name
    const submissionId = await submissionSQLServerDB.getSubmissionIdByFileName(
      fileName
    );

    // Check if submission ID is found
    if (submissionId !== null) {
      // Submission ID found, return it as response
      return res.status(200).json(submissionId);
    } else {
      // No submission found with the provided file name
      return res
        .status(404)
        .json({ message: "Submission not found for the provided file name" });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error in getting submission ID by file name:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteSubmission = async (req, res) => {
  const submissionId = parseInt(req.params.submissionId);
  try {
    // Call the deleteSubmission function with the submissionId
    await submissionMongoDB.deleteSubmission(submissionId);
    await submissionSQLServerDB.deleteSubmission(submissionId);

    // If deletion is successful, send a success response
    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error deleting submission:", error);
    res.status(500).json({ error: "Error deleting submission" });
  }
};

exports.editSubmissionName = async (req, res) => {
  const { submissionId, newFileName, newFileType } = req.body;
  try {
    // Call the editSubmission function from the model
    const success = await submissionSQLServerDB.editSubmissionName(
      submissionId,
      newFileName,
      newFileType
    );

    if (success) {
      return res
        .status(200)
        .json({ message: "Submission updated successfully" });
    } else {
      return res.status(500).json({ message: "Failed to update submission" });
    }
  } catch (error) {
    console.error("Error editing submission:", error);
    return res.status(500).json({ error: "Failed to edit submission" });
  }
};

exports.updateSubmission = async (req, res) => {
  try {
    const userId = req.user.id;
    const stdId = await studentSQLServerDB.getStudentByID(userId);
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const fileType = req.file.mimetype;
    const MongoID = req.params.MongoID;
    const submissionId = parseInt(req.params.submissionId);

    console.log("File Name:", fileName);
    console.log("File Size:", fileSize);
    console.log("File Type:", fileType);

    const file = req.file;

    console.log(file);

    // Call the method to add the submission
    const success = await submissionSQLServerDB.editSubmission(
      submissionId,
      fileName,
      fileType
    );
    const id = await submissionSQLServerDB.getSubmissionIdByFileName(fileName);

    const submission = new Submission(stdId, file, id);

    const queryResult = await submissionMongoDB.updateSubmission(
      MongoID,
      submission
    );

    // Handle the response
    if (queryResult) {
      return res
        .status(201)
        .json({ message: "Submission added successfully", status: "ok" });
    } else {
      return res
        .status(500)
        .json({ message: "Internal Server Error", queryResult });
    }
  } catch (error) {
    console.error("Error in adding submission:", error);
    return res.status(500).json({ error: "Error in adding submission" });
  }
};

exports.getMongoIdByFileName = async (req, res) => {
  const { fileName } = req.params.fileName;

  try {
    const submissionId = await submissionMongoDB.getSubmissionIdByFileName(
      fileName
    );

    if (submissionId) {
      res.status(200).json(submissionId);
    } else {
      res
        .status(404)
        .json({ message: "Submission not found for the given filename." });
    }
  } catch (error) {
    console.error("Error retrieving submission ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

///////////////////////
exports.getPreviousSubmissionID = async (req, res) => {
  try {
    const userID = req.user.id;
    const stdID = await studentSQLServerDB.getStudentByID(userID);
    const courseTopicID = req.params.courseTopicID;
    const submissionID =
      await submissionSQLServerDB.getSubmissionIDByStudentAndCourseTopic(
        stdID,
        courseTopicID
      );
    var mongoID = -1;
    if (submissionID != -1) {
      mongoID = await submissionMongoDB.getMongoIDSubmissionID(submissionID);
    }
    return res
      .status(200)
      .json({ submissionID: submissionID, mongoID: mongoID });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error in retrieving submission ID " });
  }
};

exports.getSurveysIDs = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids;
  const surveyIDs = {};

  try {
    for (const id of ids) {
      const surveyID = await surveySQLServerDB.getSurveyId(id, type);
      if (surveyID != -1) surveyIDs[id] = surveyID;
    }

    return res.status(200).json({ surveyIDs });
  } catch (error) {
    console.error("Error retrieving survey:", error.message);
    return res.status(500).json({ message: "Failed retrieving survey" });
  }
};

exports.getSurveyID = async (req, res) => {
  try {
    console.log("Get Survey ID ");
    const type = req.params.type;
    const id = parseInt(req.params.id, 10);
    const surveyID = await surveySQLServerDB.getSurveyId(id, type);

    return res.status(200).json({ surveyID: surveyID });
  } catch (error) {
    console.error("Error retrieving survey:", error.message);
    return res
      .status(500)
      .json({ message: "Failed retrieving survey", surveyID: null });
  }
};

exports.submitSurveyAnswers = async (req, res) => {
  try {
    const userID = req.user.id;
    const studentID = await studentSQLServerDB.getStudentByID(userID);
    const answers = req.body.answers;
    const surveyID = req.params.surveyID;
    const date = new Date();
    const feedback = new Feedback(null, surveyID, studentID, date, null);
    const insertFeedback = await feedbackSQLServerDB.addFeedback(feedback);
    const feedbackID = await feedbackSQLServerDB.getFeedbackId(
      studentID,
      surveyID
    );

    for (const answer of answers) {
      console.log(answer);
      const feedbackAnswer = new FeedbackAnswer(
        null,
        feedbackID,
        answer.answer,
        parseInt(answer.questionID, 10)
      );
      const insertAnswer = await feedbackAnswerSQLServerDB.addFeedbackAnswer(
        feedbackAnswer
      );
    }
    return res.status(200).json({ message: "Answers Submitted Successfully" });
  } catch (error) {
    console.error("Error submitting answers:", error.message);
    return res.status(500).json({ message: "Error submitting answers" });
  }
};
exports.getSurvey = async (req, res) => {
  try {
    const id = parseInt(req.params.surveyID, 10);
    const survey = await surveySQLServerDB.getSurveyById(id);
    return res.status(200).json({ survey });
  } catch (error) {
    console.error("Error retrieving  survey:", error.message);
    return res.status(500).json({ message: "Error retrieving  survey" });
  }
};
exports.getParticipants = async (req, res) => {
  try {
    const courseID = req.params.courseID;
    const trackID = req.params.trackID;
    const participants = await courseSQLServerDB.getCourseParticipants(
      trackID,
      courseID
    );
    var supervisor;
    var students = [];
    if (participants != null) {
      supervisor = {
        name:
          participants[0].supervisorFname +
          " " +
          participants[0].supervisorLname,
        id: participants[0].supervisorID,
      };
      for (const participant of participants) {
        const student = {
          name: participant.studentFname + " " + participant.studentLname,
          id: participant.studentID,
        };
        students.push(student);
      }
      return res
        .status(200)
        .json({ supervsior: supervisor, students: students });
    } else return res.status(500).json({ message: "No participants found " });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving  participants" });
  }
};

// testing
exports.submitAssessmentSubmission = async (req, res) => {
  try {
    const id = req.user.id;
    const file = req.file;
    const stdID = await studentSQLServerDB.getStudentByID(id);
    const date = new Date();
    const assesmentId = req.params.assesmentId;
    const insertStudentAttemptResult =
      await demoAss.addStudentAssessmentAttempt(stdID, assesmentId, 0, date, 0);
    const studentAttemptID = await demoAss.getAssessmentSubmissionID(
      date,
      stdID
    );
    const attempt = { assesmentId: assesmentId, file: file };
    const mongoInsertResult = await demoMongo.addAssessmentSubmission(attempt);
    return res
      .status(200)
      .json({
        insertStudentAttemptResult,
        studentAttemptID,
        mongoInsertResult,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding student assessment submission " });
  }
};

exports.submitAnswers = async (req, res) => {
  try {
    const userId = req.user.id;
    const studentId = await studentSQLServerDB.getStudentByID(userId);
    const {
      ASSESSMENT_ID,
      ASSESSMENT_TYPE,
      ASSESSMENT_GRADE,
      COURSE_ID,
      answers,
    } = req.body;

    const { needsManualGrading, totalQuestionsWeight } =
      checkManualGradingAndTotalWeight(answers);
    const scaledGrade = calculateScaledGrade(
      answers,
      ASSESSMENT_GRADE,
      totalQuestionsWeight
    );

    const bitFlag = needsManualGrading ? 0 : 1;
    const attemptResult = await demoAss.addStudentAssessmentAttempt(
      studentId,
      ASSESSMENT_ID,
      scaledGrade,
      new Date(),
      bitFlag
    );

    if (attemptResult.error) {
      return res
        .status(500)
        .json({ message: "Failed to add attempt", error: attemptResult.error });
    }

    const attemptID = await demoAss.getStudentAssessmentAttemptID(
      studentId,
      ASSESSMENT_ID
    );
    if (attemptID === null) {
      return res.status(500).json({ message: "Failed to retrieve attempt ID" });
    }

    const answerInsertions = answers.map((answer) =>
      demoAss.addAnswer(
        answer.ANSWER,
        studentId,
        attemptID,
        answer.A_QUESTION_ID,
        answer.GRADE
      )
    );
    const answerResults = await Promise.all(answerInsertions);

    const answerErrors = answerResults.filter((result) => result.error);
    if (answerErrors.length > 0) {
      return res
        .status(500)
        .json({ message: "Failed to add some answers", errors: answerErrors });
    }
    var message = ""
    if (ASSESSMENT_TYPE === "Placement Test") {
        console.log("$$$ - PLACEMENT TEST - $$$ ")
      
        const placementTestScore = (scaledGrade/ASSESSMENT_GRADE) * 100  
        if(placementTestScore > 60)
            {
                
                const passPlacementTest = await demoAss.passPlacementTest(studentId,ASSESSMENT_ID,COURSE_ID)
                const updatePendingCourses = await demoAss.checkAndUpdatePendingCourses(studentId)
                 message =  "You Passed Placement Test - Course Passed "

            }
            else
            {
                const failPlacementTest = await demoAss.failPlacementTest(studentId,ASSESSMENT_ID)
                message =  "You Failed Placement Test - Course Added "
            }

    }
    else
    {
        message  = " Assessment Submitted Successfully, Please Check Your Grades"
    }

    return res
      .status(200)
      .json({ message: message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error submitting answers" });
  }
};

const checkManualGradingAndTotalWeight = (answers) => {
  let needsManualGrading = false;
  let totalQuestionsWeight = 0;

  for (const ans of answers) {
    if (ans.CORRECT_ANSWER === null) needsManualGrading = true;
    totalQuestionsWeight += ans.WEIGHT;
  }

  return { needsManualGrading, totalQuestionsWeight };
};

const calculateScaledGrade = (
  answers,
  assessmentGrade,
  totalQuestionsWeight
) => {
  let scaledGrade = 0;

  for (const ans of answers) {
    if (ans.CORRECT_ANSWER === ans.ANSWER) {
      ans.GRADE = (ans.WEIGHT * assessmentGrade) / totalQuestionsWeight;
      scaledGrade += ans.GRADE;
    }
  }

  return scaledGrade;
};


exports.getAllAssessments = async (req, res) => {
  try {
    const courseID = req.params.courseID;
    const result = await demoAss.getAssessmentsForCourse(courseID);
    const submissionAssessments = await demoMongo.getAssessments(courseID);
    return res.status(200).json({ result, submissionAssessments });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in retrieving assessments for this course:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getAssessment = async (req, res) => {
  try {
    const assesmentId = parseInt(req.params.assessmentID, 10);
    console.log(assesmentId);
    const result = await demoAss.getAssessmentById(assesmentId);
    return res.status(200).json({ result });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in retrieving assessment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getGrades = async (req, res) => {
  try {
    const id = req.user.id;
    const stdID = await studentSQLServerDB.getStudentByID(id);
    const courseID = req.params.courseID;
    const results = await demoAss.getAssessmentDetails(stdID, courseID);
    if (results.error) {
      return res.status(500).json({ message: "error fetching grades Error" });
    }
    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



exports.getSupervisorUserNameByID = async (req, res) => {
  try {
    const id = req.params.supervisorID;
    const uname = await supervisorSQLServerDB.getSupervisorNamebyID(id);
    return res.status(200).json({ uname });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.skipPlacementTest = async (req, res) => {
  try {
    const id = req.user.id;
    const stdID = await studentSQLServerDB.getStudentByID(id);
    const trackID = req.params.trackID;
    const registerationResult = await trackSQLServerDB.addStudentToTrack(
      stdID,
      trackID
    );
    const coursesIds = await courseSQLServerDB.getAllCoursesForTrack(trackID);
    for (const courseId of coursesIds) {
        console.log("ID =" , courseId)
      const result = await courseSQLServerDB.registerCourse(courseId, stdID);
      console.log("Result for ID" , courseId, " = ", result)
    }
    return res.status(200).json({ status: "OK", message: "Track Registered " });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.registerPlacementTests = async (req, res) => {
  try {
    const userID = req.user.id;
    const stdId = await studentSQLServerDB.getStudentByID(userID);
    const trackID = req.params.trackID;
    const registerTrack = await trackSQLServerDB.addStudentToTrack(
      stdId,
      trackID
    );
    const selectedCoursesIds = req.body.selectedCourses; // courses the student wishes to take a placement test for
    const restOfCourses = req.body.notSelectedCourses;
    console.log(selectedCoursesIds)
    console.log(restOfCourses)
    for (const id of restOfCourses) {
      const result = await courseSQLServerDB.registerCourse(id, stdId);
      console.log("Registration Result = ", result);
    }
    for (const id of selectedCoursesIds) {
      const placementTestID = await demoAss.getPlacementTestIdByCourseId(id);
      console.log("Course ID = " , id )
      console.log("Placement Tesst ID = ", placementTestID)
      const insertResult = await demoAss.assignPlacementTestToStudent(
        stdId,
        placementTestID,
        trackID
      );
    }
    return res.status(200).json({ message: "Placement Tests Registered" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPlacementTests = async (req, res) => {
  try {
    const userID = req.user.id;
    const stdId = await studentSQLServerDB.getStudentByID(userID);
    const trackID = req.params.trackID;
    const placementTests = await demoAss.getPlacementTests(stdId, trackID);
    return res.status(200).json(placementTests);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/// Student course progression
exports.calculateCourseProgress = async (req, res) => {
  try {
    const userid = req.user.id 

    const studentID = await studentSQLServerDB.getStudentByID(userid); // Assuming this comes from req.params or req.body in a real scenario
    const courseID = req.params.courseID; // Assuming this comes from req.params or req.body in a real scenario
    console.log(courseID)
    // Fetch student's ILO progress
    const result = await courseSQLServerDB.getStudentILOsProgress(studentID, courseID);

    console.log("TESTING !!");

    let totalProgress = 0;
    const iloResults = {};

    // Loop over each ILO in the result object
    for (const [iloID, iloResult] of Object.entries(result)) {
      console.log("Testing !VALUES ::  ", iloResult);

      // Fetch the ILO weight and description
      const WEIGHT = await courseSQLServerDB.getCourseILOWeight(iloID);
      const COURSE_ILO_DESCRIPTION  = await courseSQLServerDB.getCourseILODescription(iloID);
      if (WEIGHT && COURSE_ILO_DESCRIPTION) {
    
        console.log("ILO ID = ", iloID, " WEIGHT = ", WEIGHT, " NAME = ", COURSE_ILO_DESCRIPTION);

        if (WEIGHT !== null) {
          // Calculate the scaled ILO progress
          const scaledILOProgress = (WEIGHT / 100) * iloResult.percentage;
          console.log("Percentage = ", iloResult.percentage);
          console.log("ILO Weight as percentage =  ", WEIGHT / 100);
          console.log("Scaled ILO progress = ", scaledILOProgress);

          // Add the scaled ILO progress to the total progress
          totalProgress += scaledILOProgress;

          // Add ILO details to the results
          iloResults[iloID] = {
            name: COURSE_ILO_DESCRIPTION,
            totalHypotheticalGrade: iloResult.totalHypotheticalGrade,
            studentGrade: iloResult.studentGrade,
            percentage: iloResult.percentage
          };
        } else {
          console.warn(`Weight not found for ILO ID ${iloID}`);
        }
      } else {
        console.warn(`Data not found for ILO ID ${iloID}`);
      }
    }

    console.log("Total Progress = ", totalProgress);

    return res.status(200).json({ iloResults, totalProgress });
  } catch (error) {
    console.error("Error retrieving student progress:", error);
    return res.status(500).json({ message: "Error retrieving student progress" });
  }
}
////youssef

exports.getInstructorSurveyIdForCourse = async(req, res) => {
  try {
      const courseID = req.params.courseID;
      const instructorID = req.params.instructorID;
      console.log(courseID);
      console.log(instructorID);
      // Call the function that gets the instructor survey ID
      const instructorSurveyID = await courseSQLServerDB.getSurveyInstructorID(courseID, instructorID);

      if (instructorSurveyID !== null) {
          return res.status(200).json({ instructorSurveyID });
      } else {
          return res.status(404).json({ message: "Instructor survey ID not found" });
      }

  } catch (error) {
      console.error("Error in fetching instructor survey ID:", error);
      return res.status(500).json({ message: "Error in fetching instructor survey ID" });
  }
};
