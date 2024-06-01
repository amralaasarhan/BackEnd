import AssesmentDAO from "./AssesmentDAO";
import Assesment from "./Assesment";
import { number } from "joi";
const sql = require("msnodesqlv8");
const bcrypt = require("bcrypt");

const connectionString ="server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class AssesmentSQLServer implements AssesmentDAO {
  async addAssesment(assesmentType: string,courseIloId: number
  ): Promise<void> {
    const insertQuery =
      "INSERT INTO ASSESSMENT (ASSESSMENT_TYPE, COURSE_ILO_ID_FK) VALUES (?, ?)";
    const insertValues = [assesmentType, courseIloId];

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(
          connectionString,
          insertQuery,
          insertValues,
          (err: any, results: any) => {
            if (err) {
              console.error("Error inserting record:", err);
              reject(err);
            } else {
              console.log("Query Results:", results);
              resolve(results);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error inserting record:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async addAssesmentQuestion(
    assesmentId: number,
    question: string,
    questionType: string,
    questionLevel: string
  ): Promise<void> {
    const insertQuery =
      "INSERT INTO ASSESSMENT_QUESTIONS (ASSESSMENT_ID_FK, QUESTION, QUESTION_TYPE, QUESTION_LEVEL) VALUES (?, ?, ?, ? )";
    const insertValues = [
      assesmentId,
      question,
      questionType,
      questionLevel
    ];

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(
          connectionString,
          insertQuery,
          insertValues,
          (err: any, results: any) => {
            if (err) {
              console.error("Error inserting record:", err);
              reject(err);
            } else {
              console.log("Query Results:", results);
              resolve(results);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error inserting record:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async addAnswer(
    assesmentQuestionId: number,
    answerText: string,
    correctAnswer: string
  ): Promise<void> {
    const insertQuery =
      "INSERT INTO POSSIBLE_ANSWERS (A_QUESTION_ID_FK, ANSWER_TEXT, CORRECT_ANSWER) VALUES (?, ?, ?)";
    const insertValues = [assesmentQuestionId, answerText, correctAnswer];

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(
          connectionString,
          insertQuery,
          insertValues,
          (err: any, results: any) => {
            if (err) {
              console.error("Error inserting record:", err);
              reject(err);
            } else {
              console.log("Query Results:", results);
              resolve(results);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error inserting record:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async addAssesmentQuestionAndCourseTopic(
    assesmentQuestionId: number,courseTopicId:number
  ): Promise<void> {
    const insertQuery =
      "INSERT INTO COURSE_TOPIC_ASSESSMENT_QUESTIONS (A_QUESTION_ID, COURSE_TOPIC_ID) VALUES (?, ?)";
    const insertValues = [assesmentQuestionId, courseTopicId];

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(
          connectionString,
          insertQuery,
          insertValues,
          (err: any, results: any) => {
            if (err) {
              console.error("Error inserting record:", err);
              reject(err);
            } else {
              console.log("Query Results:", results);
              resolve(results);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error inserting record:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
  async deleteAssesment(assesmentId: number): Promise<void> {
    try {
      const deleteQuery = "DELETE FROM ASSESSMENT WHERE ASSESSMENT_ID = ?";
      const assesmentToDelete = assesmentId;
      const result = await new Promise((resolve, reject) => {
        sql.queryRaw(
          connectionString,
          deleteQuery,
          [assesmentToDelete],
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error deleting Assesment:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async deleteAssesmentQuestion(assesmentQuestionId: number): Promise<void> {
    try {
      const deleteQuery =
        "DELETE FROM ASSESSMENT_QUESTIONS WHERE A_QUESTION_ID = ?";
      const assesmentQuestionToDelete = assesmentQuestionId;
      const result = await new Promise((resolve, reject) => {
        sql.queryRaw(
          connectionString,
          deleteQuery,
          [assesmentQuestionToDelete],
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error deleting Assesment Question:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  
  async deleteAnswer(answerId: number): Promise<void> {
    try {
      const deleteQuery =
        "DELETE FROM POSSIBLE_ANSWERS WHERE ANSWER_ID = ?";
      const answerToDelete = answerId;
      const result = await new Promise((resolve, reject) => {
        sql.queryRaw(
          connectionString,
          deleteQuery,
          [answerToDelete],
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error deleting Answer:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async getAssessments(): Promise<any[]> {
    const selectQuery = "SELECT * FROM ASSESSMENT";

    try {
      const results = await new Promise<any[]>((resolve, reject) => {
        sql.query(connectionString, selectQuery, (err: any, rows: any[] | PromiseLike<any[]>) => {
          if (err) {
            console.error("Error fetching assessment :", err);
            reject(err);
          } else {
            console.log("Query Results:", rows);
            resolve(rows);
          }
        });
      });
      return results;
    } catch (error) {
      console.error("Error fetching assessment:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
 }


 async getAssessmentByCourseIloId(courseIloId: number): Promise<any[]> {
  const selectQuery = "SELECT * FROM ASSESSMENT WHERE COURSE_ILO_ID_FK = ?";
    const CourseIloId=courseIloId;
  try {
    const results = await new Promise<any[]>((resolve, reject) => {
      sql.query(connectionString, selectQuery, [courseIloId], (err: any, rows: any[] | PromiseLike<any[]>) => {
        if (err) {
          console.error("Error fetching assessment by course ilo ID:", err);
          reject(err);
        } else {
          console.log("Query Results:", rows);
          resolve(rows);
        }
      });
    });
    return results;
  } catch (error) {
    console.error("Error fetching assessment  by course ID:", error);
    throw error;
  } finally {
    if (sql && sql.close) {
      await sql.close();
    }
  }
}


  async getAssessmentQuestions(): Promise<any[]> {
    const selectQuery = "SELECT * FROM ASSESSMENT_QUESTIONS";

    try {
      const results = await new Promise<any[]>((resolve, reject) => {
        sql.query(connectionString, selectQuery, (err: any, rows: any[] | PromiseLike<any[]>) => {
          if (err) {
            console.error("Error fetching assessment questions:", err);
            reject(err);
          } else {
            console.log("Query Results:", rows);
            resolve(rows);
          }
        });
      });
      return results;
    } catch (error) {
      console.error("Error fetching assessment questions:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
 }

 async getAssessmentQuestionsByAssessmentId(assesmentId: number): Promise<any[]> {
  const selectQuery = "SELECT * FROM ASSESSMENT_QUESTIONS WHERE ASSESSMENT_ID_FK = ?";
    const assesmentid=assesmentId;
  try {
    const results = await new Promise<any[]>((resolve, reject) => {
      sql.query(connectionString, selectQuery, [assesmentid], (err: any, rows: any[] | PromiseLike<any[]>) => {
        if (err) {
          console.error("Error fetching assessment questions by assessment ID:", err);
          reject(err);
        } else {
          console.log("Query Results:", rows);
          resolve(rows);
        }
      });
    });
    return results;
  } catch (error) {
    console.error("Error fetching assessment questions by assessment ID:", error);
    throw error;
  } finally {
    if (sql && sql.close) {
      await sql.close();
    }
  }
}
 

async getAnswerByAssessmentQuestionId(assesmentQuestionId: number): Promise<any[]> {
  const selectQuery = "SELECT * FROM POSSIBLE_ANSWERS WHERE A_QUESTION_ID_FK = ?";
    const AssesmentQuestionId=assesmentQuestionId;
  try {
    const results = await new Promise<any[]>((resolve, reject) => {
      sql.query(connectionString, selectQuery, [AssesmentQuestionId], (err: any, rows: any[] | PromiseLike<any[]>) => {
        if (err) {
          console.error("Error fetching answer  by assessment questions ID:", err);
          reject(err);
        } else {
          console.log("Query Results:", rows);
          resolve(rows);
        }
      });
    });
    return results;
  } catch (error) {
    console.error("Error fetching answer  by assessment questions ID:", error);
    throw error;
  } finally {
    if (sql && sql.close) {
      await sql.close();
    }
  }
}


uploadAssessmentFile(filename: string, fileData: Buffer): Promise<String> {
  throw new Error("Method not implemented.");
}

}  



export default AssesmentSQLServer;
