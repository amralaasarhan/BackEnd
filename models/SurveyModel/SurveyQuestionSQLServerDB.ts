import SurveyQuestion from "./SurveyQuestion";
import SurveyQuestionDAO from "./SurveyQuestionDAO";

const sql = require("msnodesqlv8");

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
class SurveyQuestionSQLServerDB implements SurveyQuestionDAO {
    async addQuestion(question: SurveyQuestion): Promise<void> {
        const insertQuery = "INSERT INTO SURVEY_QUESTIONS (SURVEY_ID, QUESTION, Q_TYPE) VALUES (?, ?, ?)";
        const insertValues = [question.surveyID, question.question, question.q_type];
        try {
          const results = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
              if (err) {
                console.error('Error inserting survey question record:', err);
                reject(err);
              } else {
                console.log('Query Results:', results);
                resolve(results);
              }
            });
          });
        } catch (error) {
          console.error('Error inserting survey question record:', error);
          throw error;
        } finally {
          if (sql && sql.close) {
            await sql.close();
          }
        }
    }
    async editQuestion(questionId: number, updateData: any): Promise<void> {
        try {
            console.log("Update Data", updateData);
    
            if (!Object.keys(updateData).length || !questionId) {
                throw new Error("No data to update or question ID provided.");
            }
    
            const updateColumnsArray = Object.keys(updateData).map(column => {
                return updateData[column] !== undefined ? `${column} = ?` : null;
            });
    
            const updateColumns = updateColumnsArray.filter(column => column !== null).join(', ');
    
            const updateQuery = `UPDATE SURVEY_QUESTIONS SET ${updateColumns} WHERE QUESTION_ID = ?`;
    
            console.log('Generated Query:', updateQuery);
    
            // Prepare parameters
            const params = [...Object.values(updateData), questionId];
    
            // Execute the query directly
            await new Promise((resolve, reject) => {
                sql.query(connectionString, updateQuery, params, (err: any, results: any) => {
                    if (err) {
                        console.error("Error updating survey question:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
        } catch (error) {
            console.error("Error updating survey question:", error);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }
    
    async deleteQuestion(questionID: number): Promise<void> {
        try {
            const deleteQuery = 'DELETE FROM SURVEY_QUESTIONS WHERE QUESTION_ID = ?';
            const deleteValues = [questionID];
    
            // Execute the deletion query
            const results = await new Promise<void>((resolve, reject) => {
                sql.queryRaw(connectionString, deleteQuery, deleteValues, (err: any) => {
                    if (err) {
                        console.error('Error deleting question:', err);
                        reject(err);
                    } else {
                        console.log('Question deleted successfully.');
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error('Error deleting question:', error);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }
    

} export default SurveyQuestionSQLServerDB