//User Model
const { default: User } = require("../models/UserModel/User");
const {
  default: UserSQLServerDB,
} = require("../models/UserModel/UserSQLServerDB");
const userSQLServerDB = new UserSQLServerDB();

//Admin Model
const { default: Admin } = require("../models/AdminModel/Admin");
const {
  default: AdminSQLServerDB,
} = require("../models/AdminModel/AdminSQLServerDB");
const adminSQLServerDB = new AdminSQLServerDB();

//Supervisor Model
const { default: Supervisor } = require("../models/SupervisorModel/Supervisor");
const {
  default: SupervisorSQLServerDB,
} = require("../models/SupervisorModel/SupervisorSQLServerDB");
const {
  default: SupervisorMongoDB,
} = require("../models/SupervisorModel/SupervisorMongoDB");
const supervisorSQLServerDB = new SupervisorSQLServerDB();
const supervisorMongoDB = new SupervisorMongoDB();

//Expert Model
const { default: Expert } = require("../models/ExpertModel/Expert");
const {
  default: ExpertSQLServerDB,
} = require("../models/ExpertModel/ExpertSQLServerDB");
const {
  default: ExpertMongoDB,
} = require("../models/ExpertModel/ExpertMongoDB");
const expertSQLServerDB = new ExpertSQLServerDB();
const expertMongoDB = new ExpertMongoDB();

//Instructor Model
const { default: Instructor } = require("../models/InstructorModel/instructor");
const {
  default: InstructorSQLServerDB,
} = require("../models/InstructorModel/InstructorSQLServerDB");
const {
  default: InstructorMongoDB,
} = require("../models/InstructorModel/InstructorMongoDB");
const instructorSQLServerDB = new InstructorSQLServerDB();
//const instructorMongoDB = new InstructorMongoDB();

//Company Representative Model
const {
  default: CompanyRepresentative,
} = require("../models/CompanyRepresentativeModel/CompanyRepresenative");
const {
  default: CompanyRepresentativeSQLServerDB,
} = require("../models/CompanyRepresentativeModel/CompanyRepresenativeSQLServerDB");
const {
  default: CompanyRepresentativeMongoDB,
} = require("../models/CompanyRepresentativeModel/CompanyRepresenativeMongoDB");
const companyRepresentativeSQLServerDB = new CompanyRepresentativeSQLServerDB();
const companyRepresentativeMongoDB = new CompanyRepresentativeMongoDB();

//StudentModel
const { default: Student } = require("../models/StudentModel/Student");
const {
  default: StudentSQLServerDB,
} = require("../models/StudentModel/StudentSQLServerDB");
const {
  default: StudentMongoDB,
} = require("../models/StudentModel/StudentMongoDB");
const studentSQLServerDB = new StudentSQLServerDB();
const studentMongoDB = new StudentMongoDB();

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

//Profile Picture Model
const {
  default: ProfilePictureModel,
} = require("../models/ProfilePictures/ProfilePicture");
const profilePictureModel = new ProfilePictureModel();

//Track model
const { default: Track } = require("../models/TrackModel/Track");
const { default: TrackImage } = require("../models/TrackModel/TrackImage");
const {
  default: TrackSQLServerDB,
} = require("../models/TrackModel/TrackSQLServerDB");
const trackSQLServerDB = new TrackSQLServerDB();
const trackImageModel = new TrackImage();

//Course Model
const { default: Course } = require("../models/CourseModel/Course");
const { default: CourseImage } = require("../models/CourseModel/CourseImage");
const {
  default: CourseSQLServerDB,
} = require("../models/CourseModel/CourseSQLServerDB");
const courseSQLServerDB = new CourseSQLServerDB();
const CourseImageModel = new CourseImage();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: process.env.type,
    user: process.env.user,
    pass: process.env.pass,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    refreshToken:
    process.env.refreshToken
  },
});

exports.sendResetLink = async (req, res) => {
  const userEmail = req.body.email;
  const user = await userSQLServerDB.getUserByEmail(userEmail);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const token = jwt.sign({ userEmail }, "420420", { expiresIn: "1h" });
  const resetLink = `http://localhost:4200/reset-password?token=${token}`;

  let mailOptions = {
    from: "summertrainingproject1@gmail.com",
    to: userEmail,
    subject: "Password Reset",
    html: `Click <a href="${resetLink}">here</a> to reset your password.`,
  };
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
      return res.json({ message: "Reset link sent to your email" });
    }
  });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  // Verify token
  jwt.verify(token, "420420", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    try {
      const { userEmail } = decoded;

      const salt = bcrypt.genSaltSync(10);
      const hashedPass = bcrypt.hashSync(newPassword, salt);
      await userSQLServerDB.updateUser(
        { EMAIL: userEmail },
        { PASS: hashedPass }
      );

      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Error updating user password:", error);
      res
        .status(500)
        .json({ error: "An error occurred while resetting the password" });
    }
  });
};

//////////////------------Schema of users------------/////////////////////////////
const otherUsersSchema = Joi.object({
  fName: Joi.string().required(),
  lName: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(4).max(30).required(),
  pass: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  mobile: Joi.string().min(9).max(14).required(),
  userType: Joi.string()
    .valid("path_supervisor", "student", "instructor")
    .required(),
  date: Joi.date().iso().required(),
  specialization: Joi.string().allow(""),
  companyName: Joi.string().allow(""),
});

exports.signup = async (request, response) => {
  const userType = request.body.userType;
  if (userType === "student") {
    try {
      bday = new Date(request.body.date);
      try {
        await otherUsersSchema.validateAsync(request.body, {
          abortEarly: false,
        });
      } catch (error) {
        return response.status(400).json({
          status: "Error",
          message: "Validation Error",
          errors: error.details.map((detail) => detail.message),
        });
      }

      // Check Duplication
      const emailFilter = await userSQLServerDB.getUserByEmail(
        request.body.email
      );
      const userNameFilter = await userSQLServerDB.getUserByUsername(
        request.body.username
      );

      if (emailFilter || userNameFilter) {
        return response.status(400).json({
          status: "Error",
          message: "This email/username already exists",
        });
      }

      const student = new Student(
        request.body.fName,
        request.body.lName,
        request.body.email,
        request.body.username,
        request.body.pass,
        request.body.mobile,
        request.body.userType,
        bday
      );

      // Password Encryption
      const password = student.pass;
      const salt = bcrypt.genSaltSync(10);
      const hashedPass = bcrypt.hashSync(password, salt);
      student.pass = hashedPass;

      //Add User Query
      const addUserQuery = await userSQLServerDB.addUser(student);
      const getUserIdQuery = await userSQLServerDB.getUserByEmail(
        student.email
      );
      console.log("Enduser id", getUserIdQuery[0]);
      const addStudentQuery = await studentSQLServerDB.addStudent(
        getUserIdQuery[0]
      );

      return response.status(200).json({
        status: "OK",
        message: "Sign up successful",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  } else if (userType === "path_supervisor") {
    try {
      bday = new Date(request.body.date);

      try {
        await otherUsersSchema.validateAsync(request.body, {
          abortEarly: false,
        });
      } catch (error) {
        return response.status(400).json({
          status: "Error",
          message: "Validation Error",
          errors: error.details.map((detail) => detail.message),
        });
      }

      // Check Duplication
      const emailFilter = await userSQLServerDB.getUserByEmail(
        request.body.email
      );
      const userNameFilter = await userSQLServerDB.getUserByUsername(
        request.body.username
      );

      if (emailFilter || userNameFilter) {
        return response.status(400).json({
          status: "Error",
          message: "This email/username already exists",
        });
      }

      const supervisor = new Supervisor(
        request.body.fName,
        request.body.lName,
        request.body.email,
        request.body.username,
        request.body.pass,
        request.body.mobile,
        request.body.userType,
        bday
      );

      // Password Encryption
      const password = supervisor.pass;
      const salt = bcrypt.genSaltSync(10);
      const hashedPass = bcrypt.hashSync(password, salt);
      supervisor.pass = hashedPass;

      //Add User Query
      const addUserQuery = await userSQLServerDB.addUser(supervisor);
      const getUserIdQuery = await userSQLServerDB.getUserByEmail(
        supervisor.email
      );
      console.log("Enduser id", getUserIdQuery[0]);
      const addSupervisorQuery = await supervisorSQLServerDB.addSupervisor(
        getUserIdQuery[0]
      );

      return response.status(200).json({
        status: "OK",
        message: "Sign up successful",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  } else if (userType === "instructor") {
    try {
      bday = new Date(request.body.date);

      try {
        await otherUsersSchema.validateAsync(request.body, {
          abortEarly: false,
        });
      } catch (error) {
        return response.status(400).json({
          status: "Error",
          message: "Validation Error",
          errors: error.details.map((detail) => detail.message),
        });
      }

      // Check Duplication
      const emailFilter = await userSQLServerDB.getUserByEmail(
        request.body.email
      );
      const userNameFilter = await userSQLServerDB.getUserByUsername(
        request.body.username
      );

      if (emailFilter || userNameFilter) {
        return response.status(400).json({
          status: "Error",
          message: "This email/username already exists",
        });
      }

      const instructor = new Instructor(
        request.body.fName,
        request.body.lName,
        request.body.email,
        request.body.username,
        request.body.pass,
        request.body.mobile,
        request.body.userType,
        bday
      );

      // Password Encryption
      const password = instructor.pass;
      const salt = bcrypt.genSaltSync(10);
      const hashedPass = bcrypt.hashSync(password, salt);
      instructor.pass = hashedPass;

      //Add User Query
      const addUserQuery = await userSQLServerDB.addUser(instructor);
      const getUserIdQuery = await userSQLServerDB.getUserByEmail(
        instructor.email
      );
      console.log("Enduser id", getUserIdQuery[0]);
      const addInstructorIdQuery = await instructorSQLServerDB.addInstructor(
        getUserIdQuery[0]
      );

      return response.status(200).json({
        status: "OK",
        message: "Sign up successful",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  } else if (userType === "expert") {
    try {
      bday = new Date(request.body.date);

      const expertSchema = Joi.object({
        fName: Joi.string().required(),
        lName: Joi.string().required(),
        email: Joi.string().email().required(),
        username: Joi.string().min(4).max(30).required(),
        pass: Joi.string().min(8).required(),
        mobile: Joi.string().min(9).max(14).required(),
        userType: Joi.string().valid("expert").required(),
        date: Joi.date().iso().required(),
        specialization: Joi.string().required(),
        companyName: Joi.string().allow(""),
      });

      try {
        await expertSchema.validateAsync(request.body, { abortEarly: false });
      } catch (error) {
        return response.status(400).json({
          status: "Error",
          message: "Validation Error",
          errors: error.details.map((detail) => detail.message),
        });
      }

      const expert = new Expert(
        request.body.fName,
        request.body.lName,
        request.body.email,
        request.body.username,
        request.body.pass,
        request.body.mobile,
        request.body.userType,
        bday,
        request.body.specialization
      );

      // Check Duplication
      const emailFilter = await userSQLServerDB.getUserByEmail(expert.email);
      const userNameFilter = await userSQLServerDB.getUserByUsername(
        expert.username
      );

      if (emailFilter || userNameFilter) {
        return response.status(400).json({
          status: "Error",
          message: "This email/username already exists",
        });
      }

      // Password Encryption
      const password = expert.pass;
      const salt = bcrypt.genSaltSync(10);
      const hashedPass = bcrypt.hashSync(password, salt);
      expert.pass = hashedPass;

      //Add User Query
      const addUserQuery = await userSQLServerDB.addUser(student);
      const getUserIdQuery = await userSQLServerDB.getUserByEmail(
        student.email
      );
      console.log("Enduser id", getUserIdQuery[0]);
      const addStudentQuery = await studentSQLServerDB.addExpert(
        getUserIdQuery[0],
        expert.specialization
      );

      return response.status(200).json({
        status: "OK",
        message: "Sign up successful",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  } else if (userType === "company_representative") {
    try {
      bday = new Date(request.body.date);

      const companyRepresentativeSchema = Joi.object({
        fName: Joi.string().required(),
        lName: Joi.string().required(),
        email: Joi.string().email().required(),
        username: Joi.string().min(4).max(30).required(),
        pass: Joi.string()
          .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
          .required(),
        mobile: Joi.string().min(9).max(14).required(),
        userType: Joi.string().valid("company_representative").required(),
        date: Joi.date().iso().required(),
        companyName: Joi.string().required(),
        specialization: Joi.string().allow(""),
      });
      try {
        await companyRepresentativeSchema.validateAsync(request.body, {
          abortEarly: false,
        });
      } catch (error) {
        return response.status(400).json({
          status: "Error",
          message: "Validation Error",
          errors: error.details.map((detail) => detail.message),
        });
      }
      const companyRepresentative = new CompanyRepresentative(
        request.body.fName,
        request.body.lName,
        request.body.email,
        request.body.username,
        request.body.pass,
        request.body.mobile,
        request.body.userType,
        bday,
        request.body.companyName
      );

      // Check Duplication
      const emailFilter = await userSQLServerDB.getUserByEmail(
        companyRepresentative.email
      );
      const userNameFilter = await userSQLServerDB.getUserByUsername(
        companyRepresentative.username
      );

      if (emailFilter || userNameFilter) {
        return response.status(400).json({
          status: "Error",
          message: "This email/username already exists",
        });
      }

      // Password Encryption
      const password = companyRepresentative.pass;
      const salt = bcrypt.genSaltSync(10);
      const hashedPass = bcrypt.hashSync(password, salt);
      companyRepresentative.pass = hashedPass;

      const addUserQuery = await userSQLServerDB.addUser(companyRepresentative);
      const getUserIdQuery = await userSQLServerDB.getUserByEmail(
        companyRepresentative.email
      );
      console.log("Enduser id", getUserIdQuery[0]);
      const addExpertQuery =
        await companyRepresentativeSQLServerDB.addCompanyRepresenative(
          getUserIdQuery[0],
          companyRepresentative.companyName
        );

      return response.status(200).json({
        status: "OK",
        message: "Sign up successful",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  }
};

//////////////------------login------------///////////////////////////////////////
exports.renderLoginForm = (request, response) => {
  response.render("UserViews/login");
};

exports.login = async (request, response) => {
  console.log("The login method entered");
  const userType = request.body.userType;
  try {
    let emailCheck, idCheck, user;
    let tokenData = {};

    switch (userType) {
      case "admin":
        const adminEmail = request.body.email;
        const adminPass = request.body.pass;
        emailCheck = await userSQLServerDB.login(adminEmail, adminPass);
        idCheck = await adminSQLServerDB.getAdminByID(emailCheck.user[0]);
        user = new Admin(
          emailCheck.user[5],
          emailCheck.user[7],
          emailCheck.user[1],
          emailCheck.user[3],
          emailCheck.user[4],
          emailCheck.user[2],
          request.body.userType,
          emailCheck.user[6],
          idCheck[3]
        );
        tokenData = {
          name: user.fName + " " + user.lName,
          userType: request.body.userType,
          id: emailCheck.user[0],
          email: emailCheck.user[1],
          role: "admin",
        };
        break;
      case "student":
        const studentEmail = request.body.email;
        const studentPass = request.body.pass;
        emailCheck = await userSQLServerDB.login(studentEmail, studentPass);
        idCheck = await studentSQLServerDB.getStudentByID(emailCheck.user[0]);
        user = new Student(
          emailCheck.user[5],
          emailCheck.user[7],
          emailCheck.user[1],
          emailCheck.user[3],
          emailCheck.user[4],
          emailCheck.user[2],
          request.body.userType,
          emailCheck.user[6]
        );
        tokenData = {
          name: user.fName + " " + user.lName,
          userType: request.body.userType,
          id: emailCheck.user[0],
          email: emailCheck.user[1],
          role: "student",
        };
        break;
      case "path_supervisor":
        const supervisorEmail = request.body.email;
        const supervisorPass = request.body.pass;
        emailCheck = await userSQLServerDB.login(
          supervisorEmail,
          supervisorPass
        );
        idCheck = await supervisorSQLServerDB.getSupervisorByID(
          emailCheck.user[0]
        );
        user = new Supervisor(
          emailCheck.user[5],
          emailCheck.user[7],
          emailCheck.user[1],
          emailCheck.user[3],
          emailCheck.user[4],
          emailCheck.user[2],
          request.body.userType,
          emailCheck.user[6]
        );
        tokenData = {
          name: user.fName + " " + user.lName,
          userType: request.body.userType,
          id: emailCheck.user[0],
          email: emailCheck.user[1],
          role: "supervisor",
        };
        break;
      case "instructor":
        const instructorEmail = request.body.email;
        const instructorPass = request.body.pass;
        emailCheck = await userSQLServerDB.login(
          instructorEmail,
          instructorPass
        );
        idCheck = await instructorSQLServerDB.getInstructorByID(
          emailCheck.user[0]
        );
        user = new Instructor(
          emailCheck.user[5],
          emailCheck.user[7],
          emailCheck.user[1],
          emailCheck.user[3],
          emailCheck.user[4],
          emailCheck.user[2],
          request.body.userType,
          emailCheck.user[6]
        );
        tokenData = {
          name: user.fName + " " + user.lName,
          userType: request.body.userType,
          id: emailCheck.user[0],
          email: emailCheck.user[1],
          role: "instructor",
        };
        break;
      case "expert":
        const expertEmail = request.body.email;
        const expertPass = request.body.pass;
        emailCheck = await userSQLServerDB.login(expertEmail, expertPass);
        idCheck = await expertSQLServerDB.getExpertByID(emailCheck.user[0]);
        user = new Expert(
          emailCheck.user[5],
          emailCheck.user[7],
          emailCheck.user[1],
          emailCheck.user[3],
          emailCheck.user[4],
          emailCheck.user[2],
          request.body.userType,
          emailCheck.user[6],
          idCheck[3]
        );
        tokenData = {
          name: user.fName + " " + user.lName,
          userType: request.body.userType,
          id: emailCheck.user[0],
          email: emailCheck.user[1],
          role: "expert",
        };
        break;
      case "company_representative":
        const companyRepresentativeEmail = request.body.email;
        const companyRepresentativePass = request.body.pass;
        emailCheck = await userSQLServerDB.login(
          companyRepresentativeEmail,
          companyRepresentativePass
        );
        idCheck =
          await companyRepresentativeSQLServerDB.getCompanyRepresenativeByID(
            emailCheck.user[0]
          );
        user = new CompanyRepresentative(
          emailCheck.user[5],
          emailCheck.user[7],
          emailCheck.user[1],
          emailCheck.user[3],
          emailCheck.user[4],
          emailCheck.user[2],
          request.body.userType,
          emailCheck.user[6],
          idCheck[3]
        );
        tokenData = {
          name: user.fName + " " + user.lName,
          userType: request.body.userType,
          id: emailCheck.user[0],
          email: emailCheck.user[1],
          role: "company_representative",
        };
        break;
      default:
        return response.status(400).json({ message: "Invalid user type" });
    }

    if (!emailCheck) {
      return response.status(404).json({
        status: "Error",
        message: "Invalid Email/Password",
      });
    }

    if (!idCheck) {
      return response.status(404).json({
        status: "Error",
        message: "wrong user type",
      });
    }

    if (emailCheck.user[8] === "DELETED") {
      return response.status(404).json({
        status: "Error",
        message: "This account is deleted",
      });
    }

    if (emailCheck.user[8] === "BLOCKED") {
      return response.status(404).json({
        status: "Error",
        message: "This account is blocked",
      });
    }

    const token = jwt.sign(tokenData, "1234567", { expiresIn: "1h" });
    console.log("Token generated:", token);
    response.cookie("token", token, {
      httpOnly: true,
      expiresIn: 3600000,
      sameSite: "None",
      secure: true,
    });

    return response.status(200).json({
      status: "OK",
      message: "login successful",
      token: token,
      user: user, // Send user data along with token
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

//////////////------------updateUser------------//////////////////////////////////
exports.updateProfile = async (request, response) => {
  const userType = request.user.userType;
  const userEmail = request.user.email;
  const userFields = [
    "FNAME",
    "LNAME",
    "EMAIL",
    "USERNAME",
    "PASS",
    "MOBILE",
    "DOB",
  ];

  try {
    const userDataToUpdate = {};
    const selectedFields = request.body.fields || [];
    const validFields = selectedFields.filter((field) =>
      userFields.includes(field)
    );

    validFields.forEach((field) => {
      userDataToUpdate[field] = request.body[field];
    });

    console.log("This is what i want to update", userDataToUpdate);
    const updateUser = await userSQLServerDB.updateUser(
      { EMAIL: userEmail },
      userDataToUpdate
    );
    const user = await userSQLServerDB.getUserByEmail(userEmail);

    // Include the token used for authentication in the response headers
    response.setHeader("Authorization", request.headers["authorization"]);
    return response
      .status(200)
      .json({ status: "OK", message: "Updated successfully", user: user });
  } catch (error) {
    console.error("Error updating profile:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

//////////////------------deleteUser------------/////////////////////////////////
exports.deleteUser = async (request, response) => {
  const userType = request.user.userType;
  try {
    let email;
    switch (userType) {
      case "student":
      case "path_supervisor":
      case "instructor":
      case "expert":
      case "company_representative":
        email = request.user.email;
        await userSQLServerDB.deleteUser(email);
        return response.status(200).json({
          status: "OK",
          message: `${userType} deleted successfully`,
        });
      default:
        return response.status(400).json({ message: "Invalid userType" });
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

//////////////------------Search Course By Name------------///////////////////////
exports.searchCoursesByName = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is missing" });
    }

    let courses = await courseSQLServerDB.getCourseByNameQuery(query);

    for (let i = 0; i < courses.length; i++) {
      const courseId = courses[i].courseId;
      // Retrieve the image associated with the course
      const courseImageQuery = await CourseImageModel.getCourseImageByID(
        courseId
      );

      if (courseImageQuery !== null && courseImageQuery.image) {
        // Convert image buffer to base64 string
        const base64Image = Buffer.from(courseImageQuery.image.buffer).toString(
          "base64"
        );
        courses[i].courseImage = base64Image;
      } else {
        // If image courseImage found, set course image to null
        courses[i].courseImage = null;
      }
    }
    console.log(courses);

    return res.status(200).json({ courses });
  } catch (error) {
    console.error("Error in searchCoursesByName controller:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//////////////------------Search Track By Name------------//////////////////////
exports.searchTrackByName = async (req, res) => {
  try {
    const { query } = req.query;

    let tracks;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is missing" });
    } else {
      // If the query parameter is provided, search tracks by name
      tracks = await trackSQLServerDB.getTrackByNameQuery(query);
    }

    // Iterate over each track to retrieve track image and associated courses
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

    return res.status(200).json({ tracks });
  } catch (error) {
    console.error("Error in track controller:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//////////////------------Get all courses ------------////////////////////////
exports.getCourses = async (request, response) => {
  try {
    const courses = await courseSQLServerDB.getAllCourses();

    for (let i = 0; i < courses.length; i++) {
      const courseId = courses[i].courseId;
      // Retrieve the image associated with the course
      const courseImageQuery = await CourseImageModel.getCourseImageByID(
        courseId
      );

      if (courseImageQuery !== null && courseImageQuery.image) {
        // Convert image buffer to base64 string
        const base64Image = Buffer.from(courseImageQuery.image.buffer).toString(
          "base64"
        );
        courses[i].courseImage = base64Image;
      } else {
        // If image courseImage found, set course image to null
        courses[i].courseImage = null;
      }
    }
    console.log(courses);
    return response.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ status: "Error", message: "Internal Server Error" });
  }
};

exports.getAvailableTracks = async (request, response) => {
  try {
    // Retrieve all tracks from the database
    const tracks = await trackSQLServerDB.getAllTracks();

    // Loop through each track to fetch associated courses and images
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

    // Send the response with the fetched tracks
    return response.status(200).json({ tracks });
  } catch (error) {
    // Handle errors appropriately
    console.error("Error fetching available tracks:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

//////////////------------Upload Profile Picture------------////////////////////
exports.renderUploadForm = (req, res) => {
  res.render("upload"); // Assuming your EJS files are in a "views" directory
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const imgData = req.file.buffer;
    const queryResult = await profilePictureModel.insertProfilePicture(
      imgData,
      userId
    );
    if (queryResult)
      return res
        .status(201)
        .json({ message: "Image Uploaded Successfuly", staus: "ok" });
    else return res.status(500).json({ message: "Internal Serval Error" });
  } catch (error) {
    return res.status(500).json({ error: "Error in uploading the image" });
  }
};

///////////////---------------sendMessage---------///////////////////
exports.sendMessage = async (req, res) => {
  try {
    console.log("Send Method entered", req.user.email);

    const senderEmail = req.user.email;
    const sender = await userSQLServerDB.getUserByEmail(senderEmail);
    const recepientUsername = req.body.to;
    const recepient = await userSQLServerDB.getUserByUsername(
      recepientUsername
    );
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

    return res.status(200).json({ message: "Message Sent!", status: "OK" });
  } catch (error) {
    console.error("Error in searchCoursesByName controller:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSentMessages = async (req, res) => {
  console.log("Get Sent Method entered", req.user.email);
  const queryResult = await userSQLServerDB.getUserByEmail(req.user.email);
  const username = queryResult[3];
  const sentMessages = await messageSQLServerDB.getSentMessages(username);
  if (sentMessages) {
    return res.status(200).json({ sentMessages });
  } else {
    return res.status(400).json({ message: "No Sent Messages" });
  }
};

exports.getReceivedMessages = async (req, res) => {
  console.log("Get Received Method entered", req.user.email);

  const queryResult = await userSQLServerDB.getUserByEmail(req.user.email);
  const username = queryResult[3];
  const receivedMessages = await messageSQLServerDB.getReceivedMessage(
    username
  );
  if (receivedMessages) {
    return res.status(200).json({ receivedMessages });
  } else {
    return res.status(400).json({ message: "No Received Messages" });
  }
};
