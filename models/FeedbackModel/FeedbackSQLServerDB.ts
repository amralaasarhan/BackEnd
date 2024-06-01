import Feedback from "./Feedback";
import FeedbackAnswer from "./FeedbackAnswer";
import FeedbackDAO from "./FeedbackDAO";

const sql = require("msnodesqlv8");
const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
class FeedbackSQLServerDB implements FeedbackDAO{
    async addFeedback(feedback: Feedback): Promise<void> {
        const insertQuery = "INSERT INTO FEEDBACK (SURVEY_ID, STUDENT_ID_FK, DATE) VALUES (?, ?, ?)";
        const insertValues = [feedback.SURVEY_ID, feedback.STUDENT_ID_FK, feedback.date];
        try {
          const results = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
              if (err) {
                console.error('Error inserting feedback record:', err);
                reject(err);
              } else {
                console.log('Query Results:', results);
                resolve(results);
              }
            });
          });
        } catch (error) {
          console.error('Error inserting feedback record:', error);
          throw error;
        } finally {
          if (sql && sql.close) {
            await sql.close();
          }
        }
    }
    async  getFeedback(surveyID: number): Promise<Feedback[]> {
        let selectQuery = 'SELECT FEEDBACK_ID, SURVEY_ID, STUDENT_ID_FK, DATE FROM FEEDBACK WHERE SURVEY_ID = ?';
        try {
            const feedbackResults = await new Promise<any>((resolve, reject) => {
                sql.queryRaw(connectionString, selectQuery, [surveyID], (err: any, results: any) => {
                    if (err) {
                        console.error("Error in database query:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
    
            const feedbackArray: Feedback[] = [];
    
            if (feedbackResults && feedbackResults.rows && feedbackResults.rows.length > 0) {
                for (const feedbackRow of feedbackResults.rows) {
                    const feedback = new Feedback(
                        feedbackRow[0], // FEEDBACK_ID
                        feedbackRow[1], // SURVEY_ID
                        feedbackRow[2], // STUDENT_ID_FK
                        new Date(feedbackRow[3]), // date
                        [] // Initialize answers array
                    );
    
                    // Fetch feedback answers
                    const feedbackAnswersResults = await new Promise<any>((resolve, reject) => {
                        sql.queryRaw(connectionString, 'SELECT E_ANSWER_ID, FEEDBACK_ID_FK, ANSWER, QUESTION_ID_FK FROM FEEDBACK_ANSWERS WHERE FEEDBACK_ID_FK = ?', [feedback.FEEDBACK_ID], (err: any, results:any) => {
                            if (err) {
                                console.error("Error fetching feedback answers:", err);
                                reject(err);
                            } else {
                                resolve(results);
                            }
                        });
                    });
    
                    const feedbackAnswers: FeedbackAnswer[] = [];
                    if (feedbackAnswersResults && feedbackAnswersResults.rows && feedbackAnswersResults.rows.length > 0) {
                        feedbackAnswersResults.rows.forEach((row: any) => {
                            const answer = new FeedbackAnswer(
                                row[0], // E_ANSWER_ID
                                row[1], // FEEDBACK_ID_FK
                                row[2], // ANSWER
                                row[3] // QUESTION_ID_FK
                            );
                            feedbackAnswers.push(answer);
                        });
                    }
                    // Assign answers to feedback
                    feedback.answers = feedbackAnswers;
                    // Add feedback to array
                    feedbackArray.push(feedback);
                }
                console.log('Feedback found:', feedbackArray);
                return feedbackArray;
            } else {
                console.error("No feedback found.");
                throw new Error('No feedback found');
            }
        } catch (error) {
            console.error("Error getting feedback:", (error as any).message);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close(); // Assuming sql.close() returns a Promise
            }
        }
    }
    
    async deleteFeedback(feedbackID: number): Promise<void> {
        try {
            // Delete feedback answers first
            const deleteFeedbackAnswers = "DELETE FROM FEEDBACK_ANSWERS WHERE FEEDBACK_ID_FK = ?";
            await new Promise((resolve, reject) => {
                sql.queryRaw(
                    connectionString,
                    deleteFeedbackAnswers,
                    [feedbackID],
                    (err: any, result: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                );
            });
    
            // Delete feedback record
            const deleteQuery = "DELETE FROM FEEDBACK WHERE FEEDBACK_ID = ?";
            await new Promise((resolve, reject) => {
                sql.queryRaw(
                    connectionString,
                    deleteQuery,
                    [feedbackID],
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
            console.error("Error deleting Feedback :", (error as any).message);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }
    async  getFeedbackId(studentId: number, surveyId: number): Promise<number | null> {
        try {
            console.log("GET FEEDBACK ID ");
            const selectQuery = 'SELECT FEEDBACK_ID FROM FEEDBACK WHERE STUDENT_ID_FK = ? AND SURVEY_ID = ?';
            let feedbackId: number | null = null;
            const result = await new Promise((resolve, reject) => {
                sql.queryRaw(connectionString, selectQuery, [studentId, surveyId], (err:any , result:any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                        if (result && result.rows && result.rows.length > 0) {
                            feedbackId = result.rows[0][0];
                            console.log("FEEDBACK ID IN MODEL = ", feedbackId);
                        }
                    }
                });
            });
            return feedbackId;
        } catch (error) {
            console.error("Error retrieving feedback ID:", (error as any).message);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }
    
    editFeedback(feedbackID: number, updateData: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}export default FeedbackSQLServerDB