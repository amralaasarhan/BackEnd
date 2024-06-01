import SubmissionDAO from "./SubmissionDAO";
import Submission from "./Submission";
import { InsertOneResult } from "mongodb";

const sql = require("msnodesqlv8");

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class SubmissionSQLServeDB implements SubmissionDAO{
    addSubmission(submission: Submission): Promise<InsertOneResult<Submission>> {
        throw new Error("Method not implemented.");
    }

    async submission(fileName: string, fileType: string, studentId: number, courseTopicId: number): Promise<void> {
        const insertQuery = `
            INSERT INTO SUBMISSION 
            (SUBMISSION_FILE_NAME, SUBMISSION_FILE_TYPE, STUDENT_ID_FK, COURSE_TOPIC_ID_FK) 
            VALUES (?, ?, ?, ?)`;
        const insertValues = [fileName, fileType, studentId, courseTopicId];
    
        try {
            const results = await new Promise<any>((resolve, reject) => {
                sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
                    if (err) {
                        console.error("Error inserting record:", err);
                        reject(err);
                    } else {
                        console.log("Query Results:", results);
                        resolve(results);
                    }
                });
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
    
    async  getSubmissionIdByFileName(fileName: string): Promise<number | null> {
        const query = `
            SELECT SUBMISSION_ID
            FROM SUBMISSION
            WHERE SUBMISSION_FILE_NAME = ?;
        `;
    
        try {
            // Execute the query
            const result: any = await new Promise<any>((resolve, reject) => {
                sql.queryRaw(connectionString, query, [fileName], (err: any, results: any) => {
                    if (err) {
                        console.error("Error executing query:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
    
            // Check if any result is found
            if (result.rows.length > 0) {
                // Return the SUBMISSION_ID from the first row
                return result.rows[0][0];
            } else {
                // No matching submission found
                return null;
            }
        } catch (error) {
            console.error("Error retrieving SUBMISSION_ID:", error);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }
    
    

    async deleteSubmission(submissionId: number): Promise<void> {
        const query = `
            DELETE FROM SUBMISSION
            WHERE SUBMISSION_ID = ?;
        `;
    
        try {
            // Execute the query
            await new Promise<void>((resolve, reject) => {
                sql.queryRaw(connectionString, query, [submissionId], (err: any) => {
                    if (err) {
                        console.error("Error executing query:", err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error("Error deleting submission:", error);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }



    async editSubmission(submissionId: number, newFileName: string, newFileType: string): Promise<boolean> {
        const updateQuery = `
            UPDATE SUBMISSION
            SET SUBMISSION_FILE_NAME = ?,
                SUBMISSION_FILE_TYPE = ?
            WHERE SUBMISSION_ID = ?;
        `;
    
        try {
            // Execute the update query
            await new Promise<void>((resolve, reject) => {
                sql.queryRaw(connectionString, updateQuery, [newFileName, newFileType, submissionId], (err: any) => {
                    if (err) {
                        console.error("Error updating submission:", err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
    
            // Return true indicating successful update
            return true;
        } catch (error) {
            console.error("Error updating submission:", error);
            throw error;
        } finally {
            // Close the SQL connection if needed
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }
    


    async getSubmissionsByCourseTopicID(courseTopicID: number): Promise<any> {
        try {
            // Query to select survey based on surveyID
            const selectSurveyQuery = 'SELECT * FROM SUBMISSION WHERE COURSE_TOPIC_ID_FK = ?';
    
            // Execute query to fetch survey details
            const submissionResults = await new Promise<any>((resolve, reject) => {
                sql.queryRaw(connectionString, selectSurveyQuery, [courseTopicID], (err: any, results: any) => {
                    if (err) {
                        console.error("Error in database query:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
    
            const submissions: { submissionID: any; fileName: any; fileType: any; studentID: any; courseTopicID: any;grade:number, total:number }[]= [] 
            if (submissionResults && submissionResults.rows && submissionResults.rows.length > 0) {
                submissionResults.rows.forEach((row:any)=> {
                const submission = {
                    submissionID: row[0],
                    fileName: row[1],
                    fileType: row[2],
                    studentID: row[3],
                    courseTopicID : row[4],
                    grade:row[5],
                    total:row[6]

                }
                  submissions.push(submission)
            });
                // Fetch survey questions based on surveyID
               return submissions
            } else {
                console.error("No submissions found for courseTopicID:", courseTopicID);
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


    
    async gradeSubmission(submissionId: number, updateData: any): Promise<void> {
        try {
            console.log("Update Data", updateData);
    
            if (!Object.keys(updateData).length || !submissionId) {
                throw new Error("No data to update or submission ID provided.");
            }
    
            const updateColumnsArray = Object.keys(updateData).map(column => {
                return updateData[column] !== undefined ? `${column} = ?` : null;
            });
    
            const updateColumns = updateColumnsArray.filter(column => column !== null).join(', ');
    
            const updateQuery = `UPDATE SUBMISSION SET ${updateColumns} WHERE SUBMISSION_ID = ?`;
    
            console.log('Generated Query:', updateQuery);
    
            // Prepare parameters
            const params = [...Object.values(updateData), submissionId];
    
            // Execute the query directly
            await new Promise((resolve, reject) => {
                sql.query(connectionString, updateQuery, params, (err: any, results: any) => {
                    if (err) {
                        console.error("Error updating submission:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
        } catch (error) {
            console.error("Error updating submission:", error);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }
    
    async getSubmissionIDByStudentAndCourseTopic(studentID: number, courseTopicID: number): Promise<number | null> {
        try {
            // Query to select submission ID based on student ID and course topic ID
            const selectSubmissionQuery = 'SELECT SUBMISSION_ID FROM SUBMISSION WHERE STUDENT_ID_FK = ? AND COURSE_TOPIC_ID_FK = ? ';
    
            // Execute the query to fetch the submission ID
            const submissionResult = await new Promise<any>((resolve, reject) => {
                sql.queryRaw(connectionString, selectSubmissionQuery, [studentID, courseTopicID], (err: any, results: any) => {
                    if (err) {
                        console.error("Error in database query:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
    
            if (submissionResult && submissionResult.rows && submissionResult.rows.length > 0) {
                // Extract the submission ID from the first row
                const submissionID = submissionResult.rows[0][0];
                return submissionID;
            } else {
                console.error("No submission found for student ID:", studentID, "and course topic ID:", courseTopicID);
                return -1;
            }
        } catch (error) {
            console.error("Error getting submission ID:", (error as any).message);
            throw error;
        } finally {
            if (sql && sql.close) {
                await sql.close();
            }
        }
    }
    
    
}

export default SubmissionSQLServeDB;