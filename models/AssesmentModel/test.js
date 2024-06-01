const { default : demoAssessmentSQLServerDB} = require("./demoAssessmentSQLServerDB")
const demoAss = new demoAssessmentSQLServerDB
const { default :CourseSQLServerDB } = require("../CourseModel/CourseSQLServerDB")
const courseSQL = new CourseSQLServerDB
courseSQL.getStudentILOsProgress(1015,8).then(result => {
    console.log('Course registration result:', result);
  });
  // courseSQL.getInstructorIdForCourse(8).then(result => {
  //   console.log('Course registration result:', result);
  // });