import { SourceTextModule } from "vm";
import Instructor from "../InstructorModel/instructor";
import DemoAssessment from "./demoAssessmentModel";
import DemoQuestion from "./demoQuestion";

const connectionString ="server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
const sql = require("msnodesqlv8");

class demoAssessmentSQLServer{
    async addAssessment(
        name: String,
        description: String,
        type: String,
        createdAt: Date,
        deadline: Date,
        bySupervisor: boolean,
        creatorID: number,
        inCourse: boolean,
        foreignKey: number,
        grade : number
      ): Promise<any> {
        let insertQuery = '';
        let insertValues: any[] = [];
      
        if (bySupervisor) {
          insertQuery = inCourse ?
            `INSERT INTO ASSESSMENT (ASSESSMENT_TYPE, PATH_SUPERVISOR_ID, COURSE_ID_FK, CREATED_AT, DEADLINE, NAME, DESCRIPTION, GRADE) VALUES (?, ?, ?, ?, ?, ?, ?,?)` :
            `INSERT INTO ASSESSMENT (ASSESSMENT_TYPE, PATH_SUPERVISOR_ID, TRACK_ID_FK, CREATED_AT, DEADLINE, NAME, DESCRIPTION, GRADE) VALUES (?, ?, ?, ?, ?, ?, ?,?)`;
        } else {
          insertQuery = inCourse ?
            `INSERT INTO ASSESSMENT (ASSESSMENT_TYPE, INSTRUCTOR_ID_FK, COURSE_ID_FK, CREATED_AT, DEADLINE, NAME, DESCRIPTION, GRADE) VALUES (?, ?, ?, ?, ?, ?, ?,?)` :
            `INSERT INTO ASSESSMENT (ASSESSMENT_TYPE, INSTRUCTOR_ID_FK, TRACK_ID_FK, CREATED_AT, DEADLINE, NAME, DESCRIPTION, GRADE) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        }
      
        insertValues = [type, creatorID, foreignKey, createdAt, deadline, name, description,grade];
      
        try {
          const results = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(
              connectionString,
              insertQuery,
              insertValues,
              (err: any, results: any) => {
                if (err) {
                  console.error("if statement error inserting record:", err);
                  reject(err);
                } else {
                  console.log("Query Results:", results);
                  resolve(results);
                }
              }
            );
          });
          
          console.log("add method returning")
          return {
            message: "Assessment added Successfully",
            results: results
          };
        } catch (error) {
          console.error("caught error  inserting record:", error);
          // Return error response
          return {
            message: "Failed to add assessment",
            error: error
          };
        } finally {
          if (sql && sql.close) {
            console.log("Add method finally exited ")
            await sql.close();
          }
        }
      }
      //need to retrieve id after insertion for the rest of logic
      async  getAssessmentID(created_at: Date, deadline: Date, name: string): Promise<number | null> {
        console.log("get method entered")
        const query = 'SELECT ASSESSMENT_ID FROM ASSESSMENT WHERE NAME = ? AND CREATED_AT = ? AND DEADLINE = ?';  
     
        var c=created_at.toISOString()
        var d= deadline.toISOString()
        // Prepare parameters for the query
        const params = [ name, c, d];
    
        try {
            // Execute the query
            const results= await new Promise<any>((resolve, reject) => {
                sql.queryRaw(connectionString,query, params, (err: any, results: any[]) => {
                    if (err) {
                        console.error("Error retrieving assessment ID:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });            
            // Check if any results were returned
            if (results && results.rows && results.rows.length > 0) {
                // Return the first ASSESSMENT_ID found
                return results.rows[0][0];
            } else {
                // No matching assessment found
                console.error("No assessment found with the given criteria");
                return null;
            }
        } catch (error) {
            console.error("Error retrieving assessment ID:", error);
            return null;
        }
    }

    async addQuestion(assessmentID:number,question: any): Promise<void> {
      const insertQuery = "INSERT INTO ASSESSMENT_QUESTIONS (ASSESSMENT_ID_FK, QUESTION, QUESTION_LEVEL, QUESTION_TYPE, CORRECT_ANSWER, ANSWER_1,ANSWER_2,ANSWER_3,ANSWER_4,COURSE_ILO_ID_FK,WEIGHT) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?, ? )";
      const insertValues = [assessmentID,question.QUESTION_TEXT, question.QUESTION_LEVEL, question.QUESTION_TYPE,question.CORRECT_ANSWER, question.ANSWER_1, question.ANSWER_2, question.ANSWER_3, question.ANSWER_4,parseInt(question.COURSE_ILO_ID,10),question.weight];
      try {
        const results = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
            if (err) {
              console.error('Error inserting assessment question record:', err);
              reject(err);
            } else {
              console.log('Query Results:', results);
              resolve(results);
            }
          });
        });
      } catch (error) {
        console.error('Error inserting assessment question record:', error);
        throw error;
      } finally {
        if (sql && sql.close) {
          await sql.close();
        }
      }
  }

  async getAssessmentsForCourse(courseID: number): Promise<DemoAssessment[]> {
    try {
        const selectAssessmentsQuery = `SELECT * FROM ASSESSMENT WHERE COURSE_ID_FK=?`;
        const assessmentResults = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(connectionString, selectAssessmentsQuery, [courseID], (err: any, results: any) => {
                if (err) {
                    console.error("Error in database query:", err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (assessmentResults && assessmentResults.rows && assessmentResults.rows.length > 0) {
            const assessments: DemoAssessment[] = [];
            for (const row of assessmentResults.rows) {
                const assessment = new DemoAssessment(
                    row[0],
                    row[1],
                    row[2],
                    row[4],
                    row[5],
                    row[7],
                    row[8],
                    row[9],
                    row[10],
                    row[11],
                    null
                );
                const questionsQuery = `SELECT * FROM ASSESSMENT_QUESTIONS WHERE ASSESSMENT_ID_FK=?`;
                const questionsResults = await new Promise<any>((resolve, reject) => {
                    sql.queryRaw(connectionString, questionsQuery, [assessment.assessmentID], (err: any, results: any) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                });

                const questions: DemoQuestion[] = [];
                if (questionsResults && questionsResults.rows && questionsResults.rows.length > 0) {
                    questionsResults.rows.forEach((questionRow: any) => {
                        const question = new DemoQuestion(
                            questionRow[0],
                            questionRow[1],
                            questionRow[2],
                            questionRow[3],
                            questionRow[4],
                            questionRow[5],
                            questionRow[6],
                            questionRow[7],
                            questionRow[8],
                            questionRow[9],
                            questionRow[10],
                            questionRow[11]
                        );
                        questions.push(question);
                    });
                }
                assessment.questions = questions;
                if(assessment.questions.length!==0)
                  assessments.push(assessment)
            }
            return assessments;
        } else {
            console.error("No assessments found for courseid :", courseID);
            throw new Error('No courseID found');
        }
    } catch (error) {
        console.error("Error getting assessments by course ID:", (error as any).message);
        throw error;
    } finally {
        if (sql && sql.close) {
            await sql.close();
        }
    }
}
async getAssessmentById(assessmentID: number): Promise<DemoAssessment> {
  try {
      const selectAssessmentQuery = `SELECT * FROM ASSESSMENT WHERE ASSESSMENT_ID=?`;
      const assessmentResult = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, selectAssessmentQuery, [assessmentID], (err: any, result: any) => {
              if (err) {
                  console.error("Error in database query:", err);
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });

      if (assessmentResult && assessmentResult.rows && assessmentResult.rows.length > 0) {
          const row = assessmentResult.rows[0];
          const assessment = new DemoAssessment(
              row[0],
              row[1],
              row[2],
              row[4],
              row[5],
              row[7],
              row[8],
              row[9],
              row[10],
              row[11],
              null
          );
          const questionsQuery = `SELECT * FROM ASSESSMENT_QUESTIONS WHERE ASSESSMENT_ID_FK=?`;
          const questionsResults = await new Promise<any>((resolve, reject) => {
              sql.queryRaw(connectionString, questionsQuery, [assessment.assessmentID], (err: any, results: any) => {
                  if (err) {
                      console.error("Error in database query:", err);
                      reject(err);
                  } else {
                      resolve(results);
                  }
              });
          });

          const questions: DemoQuestion[] = [];
          if (questionsResults && questionsResults.rows && questionsResults.rows.length > 0) {
              questionsResults.rows.forEach((questionRow: any) => {
                  const question = new DemoQuestion(
                      questionRow[0],
                      questionRow[1],
                      questionRow[2],
                      questionRow[3],
                      questionRow[4],
                      questionRow[5],
                      questionRow[6],
                      questionRow[7],
                      questionRow[8],
                      questionRow[9],
                      questionRow[10],
                      questionRow[11]
                  );
                  questions.push(question);
              });
          }
          assessment.questions = questions;
          return assessment;
      } else {
          console.error("No assessment found for assessment ID :", assessmentID);
          throw new Error('No assessment found');
      }
  } catch (error) {
      console.error("Error getting assessment by ID:", (error as any).message);
      throw error;
  } finally {
      if (sql && sql.close) {
          await sql.close();
      }
  }
}
async addAssessmentILO(assessmentID:number, iloID: number, relativeWeight: number): Promise<void> {
  console.log("****addAssessmentILO*****")
  const insertQuery = "INSERT INTO ASSESSMENTS_ILOS (ASSESSMENT_ID_FK, ILO_ID_FK, RELATIVE_WEIGHT) VALUES (?, ?, ?)";
  const insertValues = [assessmentID, iloID, relativeWeight];
  try {
    const results = await new Promise<any>((resolve, reject) => {
      sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
        if (err) {
          console.error('Error assessment_ilos  record:', err);
          reject(err);
        } else {
          console.log('Query Results:', results);
          resolve(results);
        }
      });
    });
  } catch (error) {
    console.error('Error assessment_ilos record:', error);
    throw error;
  } finally {
    if (sql && sql.close) {
      await sql.close();
    }
  }
}
async addStudentAssessmentAttempt(STUDENT_ID_FK:number ,ASSESSMENT_ID_FK: number , GRADE: number  , SUBMITTED_AT: Date, IS_COMPLETELY_GRADED: number ): Promise<void> {
  const insertQuery = "INSERT INTO ASSESSMENT_GRADES (STUDENT_ID_FK, ASSESSMENT_ID_FK, GRADE,SUBMITTED_AT , IS_COMPLETELY_GRADED) VALUES (?, ?, ?,?,?)";
  const insertValues = [STUDENT_ID_FK,ASSESSMENT_ID_FK, GRADE,SUBMITTED_AT, IS_COMPLETELY_GRADED ];
  try {
    const results = await new Promise<any>((resolve, reject) => {
      sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
        if (err) {
          console.error('Error inserting ASSESSMENT_GRADE  record:', err);
          reject(err);
        } else {
          console.log('Query Results:', results);
          resolve(results);
        }
      });
    });
    return results; // Return the results obtained from the query

  } catch (error) {
    console.error('Error inserting ASSESSMENT_GRADE record:', error);
    throw error;
  } finally {
    if (sql && sql.close) {
      await sql.close();
    }
  }
}
async  getStudentAssessmentAttemptID(STUDENT_ID_FK:number ,ASSESSMENT_ID_FK: number ): Promise<number | null> {
  const query = 'SELECT ASSESSMENT_GRADE_ID FROM ASSESSMENT_GRADES WHERE STUDENT_ID_FK = ? AND ASSESSMENT_ID_FK = ?';  


  // Prepare parameters for the query
  const params = [STUDENT_ID_FK,ASSESSMENT_ID_FK];

  try {
      // Execute the query
      const results= await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString,query, params, (err: any, results: any[]) => {
              if (err) {
                  console.error("Error retrieving ASSESSMENT_GRADE ID :", err);
                  reject(err);
              } else {
                  resolve(results);
              }
          });
      });            
      // Check if any results were returned
      if (results && results.rows && results.rows.length > 0) {
          // Return the first ASSESSMENT_ID found
          return results.rows[0][0];
      } else {
          // No matching assessment found
          console.error("No ASSESSMENT_GRADE ID  found with the given criteria");
          return null;
      }
  } catch (error) {
      console.error("Error retrieving ASSESSMENT_GRADE ID :", error);
      return null;
  }
}
async addAnswer(ANSWER:string, STUDENT_ID_FK: number, A_GRADE_FK: number, Q_ID_FK: number, GRADE: number): Promise<void> {
  const insertQuery = "INSERT INTO STUDENT_ANSWERS (ANSWER, STUDENT_ID_FK, A_GRADE_FK,Q_ID_FK, GRADE ) VALUES (?, ?, ?, ? , ?)";
  const insertValues = [ANSWER, STUDENT_ID_FK, A_GRADE_FK, Q_ID_FK,GRADE ];
  console.log("insert values , " ,  insertValues)
  try {
    const results = await new Promise<any>((resolve, reject) => {
      sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
        if (err) {
          console.error('Error student_answer  record:', err);
          reject(err);
        } else {
          console.log('Query Results:', results);
          resolve(results);
        }
      });
    });
    return results
  } catch (error) {
    console.error('Error student_answer record:', error);
    throw error;
  } finally {
    if (sql && sql.close) {
      await sql.close();
    }
  }
}

async getUngradedAttempts(courseID: number ): Promise<any> {
  try {
      const ungradedAttemptsQuery = `
      SELECT
      ENDUSER.FNAME,
      ENDUSER.LNAME,
      ASSESSMENT_GRADES.ASSESSMENT_GRADE_ID,
      ASSESSMENT.NAME,
      ASSESSMENT.ASSESSMENT_TYPE
  FROM
      ENDUSER
  JOIN
      STUDENT ON STUDENT.USER_ID_FK = ENDUSER.ID
  JOIN
      ASSESSMENT_GRADES ON ASSESSMENT_GRADES.STUDENT_ID_FK = STUDENT.STUDENT_ID
  JOIN
      ASSESSMENT ON ASSESSMENT_GRADES.ASSESSMENT_ID_FK = ASSESSMENT.ASSESSMENT_ID
  WHERE
      ASSESSMENT_GRADES.IS_COMPLETELY_GRADED = 0 
      AND ASSESSMENT.COURSE_ID_FK = ?; 
  
      `;
      const ungradedAttemptsResult = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, ungradedAttemptsQuery,[courseID], (err: any, result: any) => {
              if (err) {
                  console.error("Error in database query:", err);
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });

      if (ungradedAttemptsResult && ungradedAttemptsResult.rows && ungradedAttemptsResult.rows.length > 0) {
          const ungradedAttempts = ungradedAttemptsResult.rows.map((row: any) => (console.log(row),{
           
              FNAME: row[0],
              LNAME: row[1],
              ID: row[2],
              ASSESSMENT_NAME : row[3],
              ASSESSMENT_TYPE : row[4]
          }));
          
          return ungradedAttempts;
      } else {
          console.error("No ungraded attempts found");
          return [];
      }
  } catch (error) {
      console.error("Error getting ungraded attempts:", (error as any).message);
      throw error;
  } finally {
      if (sql && sql.close) {
          await sql.close();
      }
  }
}
async getEssayAnswersForAssessment(assessmentGradeID: number): Promise<any> {
  try {
      const selectQuery = `
      SELECT 
      SA.ANSWER_ID,
      SA.ANSWER,
      AQ.WEIGHT AS WEIGHT,
      A.GRADE AS GRADE,
      AQ.QUESTION
  FROM 
      STUDENT_ANSWERS SA
  JOIN 
      ASSESSMENT_GRADES AG ON SA.A_GRADE_FK = AG.ASSESSMENT_GRADE_ID
  JOIN 
      ASSESSMENT_QUESTIONS AQ ON SA.Q_ID_FK = AQ.A_QUESTION_ID
  JOIN 
      ASSESSMENT A ON AG.ASSESSMENT_ID_FK = A.ASSESSMENT_ID
  WHERE 
      AG.ASSESSMENT_GRADE_ID = ?
  AND 
      AQ.QUESTION_TYPE = 'Essay';

      `;
      
      const essayAnswersResult = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, selectQuery, [assessmentGradeID], (err: any, results: any) => {
              if (err) {
                  console.error("Error in database query:", err);
                  reject(err);
              } else {
                  resolve(results);
              }
          });
      });

      if (essayAnswersResult && essayAnswersResult.rows && essayAnswersResult.rows.length > 0) {
          const essayAnswers = essayAnswersResult.rows.map((row: any) => ({
              ANSWER_ID: row[0],
              ANSWER: row[1],
              WEIGHT: row[2],
              GRADE: row[3],
              QUESTION: row[4]
          }));
          return essayAnswers;
      } else {
          console.error("No essay answers found for assessment grade ID:", assessmentGradeID);
          return [];
      }
  } catch (error) {
      console.error("Error getting essay answers for assessment grade ID:", error);
      throw error;
  } finally {
      if (sql && sql.close) {
          await sql.close();
      }
  }
}
async getSumOfQuestionWeightsForAssessment(assessmentGradeID: number): Promise<number> {
  try {
      const selectQuery = `
          SELECT 
              SUM(AQ.WEIGHT) AS TOTAL_WEIGHT
          FROM 
              ASSESSMENT_QUESTIONS AQ
          JOIN 
              ASSESSMENT_GRADES AG ON AQ.ASSESSMENT_ID_FK = AG.ASSESSMENT_ID_FK
          WHERE 
              AG.ASSESSMENT_GRADE_ID = ?;
      `;
      
      const result = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, selectQuery, [assessmentGradeID], (err: any, results: any) => {
              if (err) {
                  console.error("Error in database query:", err);
                  reject(err);
              } else {
                  resolve(results);
              }
          });
      });

      if (result && result.rows && result.rows.length > 0) {
          const totalWeight = result.rows[0][0];
          return totalWeight;
      } else {
          console.error("No sum of question weights found for assessment grade ID:", assessmentGradeID);
          return 0;
      }
  } catch (error) {
      console.error("Error getting sum of question weights for assessment grade ID:", error);
      throw error;
  } finally {
      if (sql && sql.close) {
          await sql.close();
      }
  }
}
async  setStudentAnswerGrade(answerID: number, grade: number): Promise<any> {
  try {
      const updateQuery = `
          UPDATE STUDENT_ANSWERS
          SET GRADE = ?
          WHERE ANSWER_ID = ?;
      `;
      const updateResult = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, updateQuery, [grade, answerID], (err: any, result: any) => {
              if (err) {
                  console.error("Error updating student answer:", err);
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });

      return updateResult;
  } catch (error) {
      console.error("Error updating student answer:", error);
      throw error;
  } finally {
      if (sql && sql.close) {
          await sql.close();
      }
  }
}
async  updateAssessmentGrade(assessmentGradeID: number, grade: number): Promise<any> {
  try {
      const updateQuery = `
          UPDATE ASSESSMENT_GRADES
          SET GRADE = GRADE + ?,
              IS_COMPLETELY_GRADED = 1
          WHERE ASSESSMENT_GRADE_ID = ?;
      `;
      const updateResult = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, updateQuery, [grade, assessmentGradeID], (err: any, result: any) => {
              if (err) {
                  console.error("Error updating assessment grade:", err);
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });

      return updateResult;
  } catch (error) {
      console.error("Error updating assessment grade:", error);
      throw error;
  } finally {
      if (sql && sql.close) {
          await sql.close();
      }
  }
}
async  getAssessmentDetails(studentID: number, courseID: number): Promise<any[]> {
  try {
      const selectQuery = `
      SELECT
    A.NAME AS Assessment_Name,
    A.ASSESSMENT_TYPE AS Assessment_Type,
    AG.GRADE AS Assessment_Grade_By_Student, -- Renaming AG.GRADE to avoid confusion
	    A.GRADE AS TOTAL, -- Include ASSESSMENT.GRADE here

    CASE
        WHEN AG.IS_COMPLETELY_GRADED = 0 THEN 'Under Review'
        ELSE 'GRADED'
    END AS Grading_Status
FROM
    ASSESSMENT A
JOIN
    ASSESSMENT_GRADES AG ON A.ASSESSMENT_ID = AG.ASSESSMENT_ID_FK
JOIN
    STUDENT S ON AG.STUDENT_ID_FK = S.STUDENT_ID
JOIN
    COURSE C ON A.COURSE_ID_FK = C.COURSE_ID
WHERE
    S.STUDENT_ID = ?
    AND C.COURSE_ID = ?;

      `;
      
      const assessmentDetailsResult = await new Promise<any[]>((resolve, reject) => {
          sql.queryRaw(connectionString, selectQuery, [studentID, courseID], (err: any, results: any) => {
              if (err) {
                  console.error("Error in database query:", err);
                  reject(err);
              } else {
                  resolve(results.rows);
              }
          });
      });

      if (assessmentDetailsResult && assessmentDetailsResult.length > 0) {
          const assessmentDetails = assessmentDetailsResult.map((row: any) => ({
              Assessment_Name: row[0],
              Assessment_Type: row[1],
              Assessment_Grade: row[2],
              TOTAL : row[3],
              Grading_Status: row[4]
          }));
          return assessmentDetails;
      } else {
          console.error("No assessment details found for student ID:", studentID, "and course ID:", courseID);
          return [];
      }
  } catch (error) {
      console.error("Error getting assessment details:", error);
      throw error;
  } finally {
      if (sql && sql.close) {
          await sql.close();
      }
  }
}
async  getAssessmentSubmissionID(SUBMITTED_AT: Date, STUDENT_ID_FK:number): Promise<number | null> {
  console.log("get method entered")
  const query = 'SELECT ASSESSMENT_GRADE_ID FROM ASSESSMENT_GRADES WHERE SUBMITTED_AT = ? AND STUDENT_ID_FK = ? ';  

  var c=SUBMITTED_AT.toISOString()
  // Prepare parameters for the query
  const params = [ c, STUDENT_ID_FK];

  try {
      // Execute the query
      const results= await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString,query, params, (err: any, results: any[]) => {
              if (err) {
                  console.error("Error retrieving assessment ID:", err);
                  reject(err);
              } else {
                  resolve(results);
              }
          });
      });            
      // Check if any results were returned
      if (results && results.rows && results.rows.length > 0) {
          // Return the first ASSESSMENT_ID found
          return results.rows[0][0];
      } else {
          // No matching assessment found
          console.error("No assessment_grade found with the given criteria");
          return null;
      }
  } catch (error) {
      console.error("Error retrieving assessment ID:", error);
      return null;
  }
}

//AMR NEW FUNCTIONS 
async  passPlacementTest(STUDENT_ID_FK: number, PLACEMENT_TEST_ID_FK: number, courseID: number): Promise<void> {
    console.log("Pass Placement DB Function Entered ")
    const updateQuery = `UPDATE STUDENT_PLACEMENT_TEST 
                         SET STATUS = 'PASS' 
                         WHERE STUDENT_ID_FK = ? AND ASSESSMENT_ID_FK = ?`;
    const insertQuery = `INSERT INTO STUDENT_COURSE (COURSE_ID_FK, STUDENT_ID_FK, STATUS) VALUES (?, ?, ?)`;
    const insertValues = [courseID, STUDENT_ID_FK, 'PASS'];

    try {
        // Update the STUDENT_PLACEMENT_TEST table
        await new Promise<void>((resolve, reject) => {
            sql.queryRaw(connectionString, updateQuery, [STUDENT_ID_FK, PLACEMENT_TEST_ID_FK], (err: any, results: any) => {
                if (err) {
                    console.error('Error updating student placement test record:', err);
                    reject(err);
                } else {
                    console.log('Student placement test record updated successfully.');
                    resolve();
                }
            });
        });

        // Insert into the STUDENT_COURSE table
        await new Promise<void>((resolve, reject) => {
            sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
                if (err) {
                    console.error('Error inserting into student course record:', err);
                    reject(err);
                } else {
                    console.log('Student course record inserted successfully.');
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error('Error updating student placement test record:', error);
        throw error;
    } finally {
        if (sql && sql.close) {
            await sql.close();
        }
    }
}
async  failPlacementTest(STUDENT_ID_FK: number, PLACEMENT_TEST_ID_FK: number): Promise<void> {
    const updateQuery = `UPDATE STUDENT_PLACEMENT_TEST 
                         SET STATUS = 'FAIL' 
                         WHERE STUDENT_ID_FK = ? AND ASSESSMENT_ID_FK = ?`;
   


    try {
        // Update the STUDENT_PLACEMENT_TEST table
        await new Promise<void>((resolve, reject) => {
            sql.queryRaw(connectionString, updateQuery, [STUDENT_ID_FK, PLACEMENT_TEST_ID_FK], (err: any, results: any) => {
                if (err) {
                    console.error('Error updating student placement test record:', err);
                    reject(err);
                } else {
                    console.log('Student placement test record updated successfully.');
                    resolve();
                }
            });
        });

       
    } catch (error) {
        console.error('Error updating student placement test record:', error);
        throw error;
    } finally {
        if (sql && sql.close) {
            await sql.close();
        }
    }
}
async assignPlacementTestToStudent(STUDENT_ID_FK:number ,ASSESSMENT_ID_FK: number, TRACK_ID_FK: number ): Promise<void> {
    const insertQuery = "INSERT INTO STUDENT_PLACEMENT_TEST (STUDENT_ID_FK, ASSESSMENT_ID_FK,TRACK_ID_FK ) VALUES (?, ?, ?)";
    const insertValues = [STUDENT_ID_FK,ASSESSMENT_ID_FK, TRACK_ID_FK];
    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
          if (err) {
            console.error('Error registering placement test to student  record:', err);
            reject(err);
          } else {
            console.log('Query Results:', results);
            resolve(results);
          }
        });
      });
      return results; // Return the results obtained from the query
  
    } catch (error) {
      console.error('Error registering placement test to student record:', error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
  async getPlacementTests(studentID: number, trackID:number): Promise<any> {
    try {
        const selectPlacementTestsQuery = `SELECT 
        C.C_NAME AS Course_Name,
        A.NAME AS Assessment_Name,
        SPT.STATUS AS Placement_Test_Status,
        SPT.ASSESSMENT_ID_FK AS Placement_Test_ID
    FROM 
        STUDENT_PLACEMENT_TEST SPT
    JOIN 
        ASSESSMENT A ON SPT.ASSESSMENT_ID_FK = A.ASSESSMENT_ID
    JOIN 
        COURSE C ON A.COURSE_ID_FK = C.COURSE_ID
    WHERE 
        SPT.STUDENT_ID_FK = ?
        AND SPT.TRACK_ID_FK = ?
        AND SPT.STATUS = 'PENDING';
    `;

        const assessmentResults = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(connectionString, selectPlacementTestsQuery, [studentID, trackID], (err: any, results: any) => {
                if (err) {
                    console.error("Error in database query:", err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (assessmentResults && assessmentResults.rows && assessmentResults.rows.length > 0) {
          const assessments: {
            Course_Name: string,
            Assessment_Name: string,
            Placement_Test_Status: string,
            Placement_Test_ID: number
        }[] = [];
                    for (const row of assessmentResults.rows) {
                const assessment = {
                  Course_Name:row[0],
                  Assessment_Name:row[1],
                  Placement_Test_Status:row[2],
                  Placement_Test_ID:row[3]
                }
                assessments.push(assessment)
               
               
              
            }
            return assessments;
        } else {
            console.error("No placement tests found for student  :", studentID , " in track " , trackID);
            throw new Error('No courseID found');
        }
    } catch (error) {
        console.error("Error getting placement tests by student id and trackid :", (error as any).message);
        throw error;
    } finally {
        if (sql && sql.close) {
            await sql.close();
        }
    }
}

async  getPlacementTestIdByCourseId(courseID:number ):  Promise<any> {
    try {
        const query = `
            SELECT ASSESSMENT_ID
            FROM ASSESSMENT
            WHERE COURSE_ID_FK = ? AND ASSESSMENT_TYPE = 'Placement Test';
        `;
        const result = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(connectionString, query, [courseID], (err:any , results:any ) => {
                if (err) {
                    console.error("Error in database query:", err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        // Extract the ASSESSMENT_ID from the result and return it
        if (result && result.rows && result.rows.length > 0) {
            return result.rows[0][0]; // Assuming ASSESSMENT_ID is the first column
        } else {
            console.error("No placement test found for course ID:", courseID);
            return null;
        }
    } catch (error) {
        console.error("Error retrieving placement test ID:", (error as any).message);
        throw error;
    } finally {
        // Close the database connection if needed
        if (sql && sql.close) {
            await sql.close();
        }
    }
}

async  checkAndUpdatePendingCourses(studentID: number): Promise<void> {
    try {
        console.log(`Starting checkAndUpdatePendingCourses for studentID: ${studentID}`);
        
        // Get all pending courses for the student
        const pendingCoursesQuery = `
          SELECT COURSE_ID_FK
          FROM STUDENT_COURSE
          WHERE STUDENT_ID_FK = ? AND STATUS = 'PENDING';
        `;
        const pendingCourses = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, pendingCoursesQuery, [studentID], (err: any, results: any) => {
            if (err) {
              console.error("Error in database query (pendingCoursesQuery):", err);
              reject(err);
            } else {
              console.log("Pending courses:", results.rows);
              resolve(results);
            }
          });
        });
    
        for (const row of pendingCourses.rows) {
          const courseId = row[0];
          console.log(`Checking course ID: ${courseId}`);
    
          // Get prerequisites for the course
          const prerequisitesQuery = `
            SELECT PREQUISITE_ID
            FROM COURSE_PREQUISITES
            WHERE COURSE_ID_FK = ?;
          `;
          const prerequisites = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(connectionString, prerequisitesQuery, [courseId], (err: any, results: any) => {
              if (err) {
                console.error("Error in database query (prerequisitesQuery):", err);
                reject(err);
              } else {
                console.log(`Prerequisites for course ID ${courseId}:`, results.rows);
                resolve(results);
              }
            });
          });
    
          // Check if all prerequisites are passed
          let allPassed = true;
          for (const prereqRow of prerequisites.rows) {
            const prerequisiteID = prereqRow[0];
            console.log(`Checking prerequisite ID: ${prerequisiteID} for course ID: ${courseId}`);
    
            const statusQuery = `
              SELECT STATUS
              FROM STUDENT_COURSE
              WHERE COURSE_ID_FK = ? AND STUDENT_ID_FK = ? AND STATUS = 'PASS';
            `;
            const status = await new Promise<any>((resolve, reject) => {
              sql.queryRaw(connectionString, statusQuery, [prerequisiteID, studentID], (err: any, results: any) => {
                if (err) {
                  console.error("Error in database query (statusQuery):", err);
                  reject(err);
                } else {
                  console.log(`Status of prerequisite ID ${prerequisiteID} for student ID ${studentID}:`, results.rows);
                  resolve(results);
                }
              });
            });
    
            if (!(status.rows && status.rows.length > 0)) {
              console.log(`Prerequisite ID ${prerequisiteID} is not passed for course ID: ${courseId}`);
              allPassed = false;
              break;
            }
          }
    
          // Update course status if all prerequisites are passed
          if (allPassed) {
            const updateStatusQuery = `
              UPDATE STUDENT_COURSE
              SET STATUS = 'ENROLLED'
              WHERE COURSE_ID_FK = ? AND STUDENT_ID_FK = ? AND STATUS = 'PENDING';
            `;
            await new Promise<any>((resolve, reject) => {
              sql.queryRaw(connectionString, updateStatusQuery, [courseId, studentID], (err: any, results: any) => {
                if (err) {
                  console.error("Error in database query (updateStatusQuery):", err);
                  reject(err);
                } else {
                  console.log(`Updated course ID ${courseId} status to ENROLLED for student ID ${studentID}`);
                  resolve(results);
                }
              });
            });
          } else {
            console.log(`Course ID ${courseId} not updated to ENROLLED for student ID ${studentID} because not all prerequisites are passed`);
          }
        }
      } catch (error) {
        console.error("Error updating pending courses:", error);
      } finally {
        if (sql && sql.close) {
          await sql.close();
        }
      }
    }
    
}export default demoAssessmentSQLServer
