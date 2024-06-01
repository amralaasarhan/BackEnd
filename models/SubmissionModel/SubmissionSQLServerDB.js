"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql = require("msnodesqlv8");
const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
class SubmissionSQLServeDB {
    addSubmission(submission) {
        throw new Error("Method not implemented.");
    }
    submission(fileName, fileType, studentId, courseTopicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = `
            INSERT INTO SUBMISSION 
            (SUBMISSION_FILE_NAME, SUBMISSION_FILE_TYPE, STUDENT_ID_FK, COURSE_TOPIC_ID_FK) 
            VALUES (?, ?, ?, ?)`;
            const insertValues = [fileName, fileType, studentId, courseTopicId];
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, insertQuery, insertValues, (err, results) => {
                        if (err) {
                            console.error("Error inserting record:", err);
                            reject(err);
                        }
                        else {
                            console.log("Query Results:", results);
                            resolve(results);
                        }
                    });
                });
            }
            catch (error) {
                console.error("Error inserting record:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getSubmissionIdByFileName(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT SUBMISSION_ID
            FROM SUBMISSION
            WHERE SUBMISSION_FILE_NAME = ?;
        `;
            try {
                // Execute the query
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, query, [fileName], (err, results) => {
                        if (err) {
                            console.error("Error executing query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                // Check if any result is found
                if (result.rows.length > 0) {
                    // Return the SUBMISSION_ID from the first row
                    return result.rows[0][0];
                }
                else {
                    // No matching submission found
                    return null;
                }
            }
            catch (error) {
                console.error("Error retrieving SUBMISSION_ID:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    deleteSubmission(submissionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            DELETE FROM SUBMISSION
            WHERE SUBMISSION_ID = ?;
        `;
            try {
                // Execute the query
                yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, query, [submissionId], (err) => {
                        if (err) {
                            console.error("Error executing query:", err);
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            }
            catch (error) {
                console.error("Error deleting submission:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    editSubmission(submissionId, newFileName, newFileType) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateQuery = `
            UPDATE SUBMISSION
            SET SUBMISSION_FILE_NAME = ?,
                SUBMISSION_FILE_TYPE = ?
            WHERE SUBMISSION_ID = ?;
        `;
            try {
                // Execute the update query
                yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, updateQuery, [newFileName, newFileType, submissionId], (err) => {
                        if (err) {
                            console.error("Error updating submission:", err);
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                });
                // Return true indicating successful update
                return true;
            }
            catch (error) {
                console.error("Error updating submission:", error);
                throw error;
            }
            finally {
                // Close the SQL connection if needed
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getSubmissionsByCourseTopicID(courseTopicID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query to select survey based on surveyID
                const selectSurveyQuery = 'SELECT * FROM SUBMISSION WHERE COURSE_TOPIC_ID_FK = ?';
                // Execute query to fetch survey details
                const submissionResults = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectSurveyQuery, [courseTopicID], (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                const submissions = [];
                if (submissionResults && submissionResults.rows && submissionResults.rows.length > 0) {
                    submissionResults.rows.forEach((row) => {
                        const submission = {
                            submissionID: row[0],
                            fileName: row[1],
                            fileType: row[2],
                            studentID: row[3],
                            courseTopicID: row[4],
                            grade: row[5],
                            total: row[6]
                        };
                        submissions.push(submission);
                    });
                    // Fetch survey questions based on surveyID
                    return submissions;
                }
                else {
                    console.error("No submissions found for courseTopicID:", courseTopicID);
                    throw new Error('No survey found');
                }
            }
            catch (error) {
                console.error("Error getting survey by ID:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    gradeSubmission(submissionId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield new Promise((resolve, reject) => {
                    sql.query(connectionString, updateQuery, params, (err, results) => {
                        if (err) {
                            console.error("Error updating submission:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
            }
            catch (error) {
                console.error("Error updating submission:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getSubmissionIDByStudentAndCourseTopic(studentID, courseTopicID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query to select submission ID based on student ID and course topic ID
                const selectSubmissionQuery = 'SELECT SUBMISSION_ID FROM SUBMISSION WHERE STUDENT_ID_FK = ? AND COURSE_TOPIC_ID_FK = ? ';
                // Execute the query to fetch the submission ID
                const submissionResult = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectSubmissionQuery, [studentID, courseTopicID], (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                if (submissionResult && submissionResult.rows && submissionResult.rows.length > 0) {
                    // Extract the submission ID from the first row
                    const submissionID = submissionResult.rows[0][0];
                    return submissionID;
                }
                else {
                    console.error("No submission found for student ID:", studentID, "and course topic ID:", courseTopicID);
                    return -1;
                }
            }
            catch (error) {
                console.error("Error getting submission ID:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
}
exports.default = SubmissionSQLServeDB;
