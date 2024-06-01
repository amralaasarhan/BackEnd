import Survey from "./Survey";
import SurveyDAO from "./SurveyDAO";
import SurveyQuestion from "./SurveyQuestion";

const sql = require("msnodesqlv8");

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class SurveySQLServerDB implements SurveyDAO {
  
    
     async addSurvey(survey: Survey): Promise<void> {
        const insertQuery = "INSERT INTO SURVEY (DATE, COURSE_ID_FK, TRACK_ID_FK, INSTRUCTOR_ID_FK ) VALUES (?, ?, ?, ?)";
        const insertValues = [survey.date, survey.courseFK, survey.trackFK, survey.instructorFK];
        try {
          const results = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
              if (err) {
                console.error('Error inserting survey record:', err);
                reject(err);
              } else {
                console.log('Query Results:', results);
                resolve(results);
              }
            });
          });
        } catch (error) {
          console.error('Error inserting survey record:', error);
          throw error;
        } finally {
          if (sql && sql.close) {
            await sql.close();
          }
        }
      }
    async getSurvey(id: number|null , idType: string|null ): Promise<Survey> {
        let selectQuery: string;
        let fkColumnName: string;
    
        if (idType === 'course') {
            selectQuery = 'SELECT * FROM SURVEY WHERE COURSE_ID_FK = ?';
            fkColumnName = 'COURSE_ID_FK';
        } else if (idType === 'track') {
            selectQuery = 'SELECT * FROM SURVEY WHERE TRACK_ID_FK = ?';
            fkColumnName = 'TRACK_ID_FK';
        }else if (idType === 'instructor')
        {
            selectQuery = 'SELECT * FROM SURVEY WHERE INSTRUCTOR_ID_FK = ?';
            fkColumnName = 'INSTRUCTOR_ID_FK';
        } 
        else {
            selectQuery = 'SELECT * FROM SURVEY WHERE INSTRUCTOR_ID_FK is NULL AND COURSE_ID_FK is NULL AND TRACK_ID_FK is NULL';
        }
    
        try {
            const surveyResults = await new Promise<any>((resolve, reject) => {
                sql.queryRaw(connectionString, selectQuery, [id], (err: any, results: any) => {
                    if (err) {
                        console.error("Error in database query:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
    
            if (surveyResults && surveyResults.rows && surveyResults.rows.length > 0) {
                const surveyRow = surveyResults.rows[0];
                const survey = new Survey(
                    surveyRow[0],  // surveyID
                    new Date(surveyRow[1]),  // date
                    surveyRow[2],  // courseFK
                    surveyRow[3],  // trackFK
                    null,  // questions (will be populated later
                    surveyRow[4] //instructor fk  
                );
    
                // Fetch survey questions
                const surveyQuestionsResults = await new Promise<any>((resolve, reject) => {
                    sql.queryRaw(connectionString, 'SELECT * FROM SURVEY_QUESTIONS WHERE SURVEY_ID = ?', [survey.surveyID], (err: any, results: any) => {
                        if (err) {
                            console.error("Error fetching survey questions:", err);
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                });
    
                const surveyQuestions: SurveyQuestion[] = [];
                if (surveyQuestionsResults && surveyQuestionsResults.rows && surveyQuestionsResults.rows.length > 0) {
                    surveyQuestionsResults.rows.forEach((row: any) => {
                        const question = new SurveyQuestion(
                            row[0],  // questionID
                            row[1],  // surveyID
                            row[2],  // question
                            row[3]   // q_type
                        );
                        surveyQuestions.push(question);
                    });
                }
    
                // Assign questions to survey
                survey.questions = surveyQuestions;
    
                console.log('Survey found:', survey);
                return survey;
            } else {
                console.error("No survey found.");
                throw new Error('No survey found');
            }
        } catch (error) {
            console.error("Error getting survey:", (error as any).message);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }
    
    async deleteSurvey(surveyID: number): Promise<void> {
        try {
            // Delete survey questions first
            const deleteQuestionsQuery = "DELETE FROM SURVEY_QUESTIONS WHERE SURVEY_ID = ?";
            await new Promise((resolve, reject) => {
                sql.queryRaw(
                    connectionString,
                    deleteQuestionsQuery,
                    [surveyID],
                    (err: any, result: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                );
            });
    
            // Delete survey record
            const deleteQuery = "DELETE FROM SURVEY WHERE SURVEY_ID = ?";
            await new Promise((resolve, reject) => {
                sql.queryRaw(
                    connectionString,
                    deleteQuery,
                    [surveyID],
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
            console.error("Error deleting Survey:", (error as any).message);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }
    editSurvey(survey: Survey): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getSurveyId(id: number|null, idType: string|null): Promise<number> {
        let selectQuery: string;
        let fkColumnName: string;
    
        if (idType === 'course') {
            selectQuery = 'SELECT SURVEY_ID FROM SURVEY WHERE COURSE_ID_FK = ?';
            fkColumnName = 'COURSE_ID_FK';
        } else if (idType === 'track') {
            selectQuery = 'SELECT SURVEY_ID FROM SURVEY WHERE TRACK_ID_FK = ?';
            fkColumnName = 'TRACK_ID_FK';
        } 
        else if (idType ==='instructor')
            {
                //fix later 
                selectQuery = 'SELECT SURVEY_ID FROM SURVEY WHERE INSTRUCTOR_ID_FK = ?';
                fkColumnName = 'INSTRUCTOR_ID_FK';
            }
            else {
            selectQuery = 'SELECT SURVEY_ID FROM SURVEY WHERE COURSE_ID_FK is NULL AND TRACK_ID_FK is NULL AND INSTRUCTOR_ID_FK is NULL '
        }
    
        try {
            const surveyIdResult = await new Promise<number>((resolve, reject) => {
                sql.queryRaw(connectionString, selectQuery, [id], (err: any, results: any) => {
                    if (err) {
                        console.error("Error in database query:", err);
                        reject(err);
                    } else {
                        if (results && results.rows && results.rows.length > 0) {
                            // Resolve with the first survey ID found
                            resolve(results.rows[0][0]);
                        } else {
                            // Resolve with null if no survey ID found
                            resolve(-1);
                        }
                    }
                });
            });
    
            return surveyIdResult;
        } catch (error) {
            console.error("Error getting survey ID:", (error as any).message);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }

    async getSurveyById(surveyID: number): Promise<Survey> {
        try {
            // Query to select survey based on surveyID
            const selectSurveyQuery = 'SELECT * FROM SURVEY WHERE SURVEY_ID = ?';
    
            // Execute query to fetch survey details
            const surveyResults = await new Promise<any>((resolve, reject) => {
                sql.queryRaw(connectionString, selectSurveyQuery, [surveyID], (err: any, results: any) => {
                    if (err) {
                        console.error("Error in database query:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
    
            // Check if survey is found
            if (surveyResults && surveyResults.rows && surveyResults.rows.length > 0) {
                const surveyRow = surveyResults.rows[0];
                const survey = new Survey(
                    surveyRow[0],  // surveyID
                    new Date(surveyRow[1]),  // date
                    surveyRow[2],  // courseFK
                    surveyRow[3],  // trackFK
                    null  // questions (will be populated later)
                    , surveyRow[4]  // insstructor ID 
                );
    
                // Fetch survey questions based on surveyID
                const selectQuestionsQuery = 'SELECT * FROM SURVEY_QUESTIONS WHERE SURVEY_ID = ?';
    
                const surveyQuestionsResults = await new Promise<any>((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuestionsQuery, [surveyID], (err: any, results: any) => {
                        if (err) {
                            console.error("Error fetching survey questions:", err);
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                });
    
                // Create SurveyQuestion objects from results
                const surveyQuestions: SurveyQuestion[] = [];
                if (surveyQuestionsResults && surveyQuestionsResults.rows && surveyQuestionsResults.rows.length > 0) {
                    surveyQuestionsResults.rows.forEach((row: any) => {
                        const question = new SurveyQuestion(
                            row[0],  // questionID
                            row[1],  // surveyID
                            row[2],  // question
                            row[3]   // q_type
                        );
                        surveyQuestions.push(question);
                    });
                }
    
                // Assign questions to survey
                survey.questions = surveyQuestions;
    
                console.log('Survey found:', survey);
                return survey;
            } else {
                console.error("No survey found for surveyID:", surveyID);
                throw new Error('No survey found');
            }
        } catch (error) {
            console.error("Error getting survey by ID:", (error as any).message);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }
    async getInstructorSurveyIDForCoure(id: number, idType: string): Promise<number> {
        let selectQuery: string;
        let fkColumnName: string;
    
        if (idType === 'course') {
            selectQuery = 'SELECT SURVEY_ID FROM SURVEY WHERE COURSE_ID_FK = ? AND INSTRUCTOR_ID_FK <> NULL ';
            fkColumnName = 'COURSE_ID_FK';
        } else if (idType === 'track') {
            selectQuery = 'SELECT SURVEY_ID FROM SURVEY WHERE TRACK_ID_FK = ?';
            fkColumnName = 'TRACK_ID_FK';
        } 
            else {
            throw new Error('Invalid idType provided');
        }
    
        try {
            const surveyIdResult = await new Promise<number>((resolve, reject) => {
                sql.queryRaw(connectionString, selectQuery, [id], (err: any, results: any) => {
                    if (err) {
                        console.error("Error in database query:", err);
                        reject(err);
                    } else {
                        if (results && results.rows && results.rows.length > 0) {
                            // Resolve with the first survey ID found
                            resolve(results.rows[0][0]);
                        } else {
                            // Resolve with null if no survey ID found
                            resolve(-1);
                        }
                    }
                });
            });
    
            return surveyIdResult;
        } catch (error) {
            console.error("Error getting survey ID:", (error as any).message);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }

    
}export default SurveySQLServerDB