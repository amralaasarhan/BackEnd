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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Feedback_1 = __importDefault(require("./Feedback"));
const FeedbackAnswer_1 = __importDefault(require("./FeedbackAnswer"));
const sql = require("msnodesqlv8");
const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
class FeedbackSQLServerDB {
    addFeedback(feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO FEEDBACK (SURVEY_ID, STUDENT_ID_FK, DATE) VALUES (?, ?, ?)";
            const insertValues = [feedback.SURVEY_ID, feedback.STUDENT_ID_FK, feedback.date];
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, insertQuery, insertValues, (err, results) => {
                        if (err) {
                            console.error('Error inserting feedback record:', err);
                            reject(err);
                        }
                        else {
                            console.log('Query Results:', results);
                            resolve(results);
                        }
                    });
                });
            }
            catch (error) {
                console.error('Error inserting feedback record:', error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getFeedback(surveyID) {
        return __awaiter(this, void 0, void 0, function* () {
            let selectQuery = 'SELECT FEEDBACK_ID, SURVEY_ID, STUDENT_ID_FK, DATE FROM FEEDBACK WHERE SURVEY_ID = ?';
            try {
                const feedbackResults = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, [surveyID], (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                const feedbackArray = [];
                if (feedbackResults && feedbackResults.rows && feedbackResults.rows.length > 0) {
                    for (const feedbackRow of feedbackResults.rows) {
                        const feedback = new Feedback_1.default(feedbackRow[0], // FEEDBACK_ID
                        feedbackRow[1], // SURVEY_ID
                        feedbackRow[2], // STUDENT_ID_FK
                        new Date(feedbackRow[3]), // date
                        [] // Initialize answers array
                        );
                        // Fetch feedback answers
                        const feedbackAnswersResults = yield new Promise((resolve, reject) => {
                            sql.queryRaw(connectionString, 'SELECT E_ANSWER_ID, FEEDBACK_ID_FK, ANSWER, QUESTION_ID_FK FROM FEEDBACK_ANSWERS WHERE FEEDBACK_ID_FK = ?', [feedback.FEEDBACK_ID], (err, results) => {
                                if (err) {
                                    console.error("Error fetching feedback answers:", err);
                                    reject(err);
                                }
                                else {
                                    resolve(results);
                                }
                            });
                        });
                        const feedbackAnswers = [];
                        if (feedbackAnswersResults && feedbackAnswersResults.rows && feedbackAnswersResults.rows.length > 0) {
                            feedbackAnswersResults.rows.forEach((row) => {
                                const answer = new FeedbackAnswer_1.default(row[0], // E_ANSWER_ID
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
                }
                else {
                    console.error("No feedback found.");
                    throw new Error('No feedback found');
                }
            }
            catch (error) {
                console.error("Error getting feedback:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close(); // Assuming sql.close() returns a Promise
                }
            }
        });
    }
    deleteFeedback(feedbackID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delete feedback answers first
                const deleteFeedbackAnswers = "DELETE FROM FEEDBACK_ANSWERS WHERE FEEDBACK_ID_FK = ?";
                yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteFeedbackAnswers, [feedbackID], (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                // Delete feedback record
                const deleteQuery = "DELETE FROM FEEDBACK WHERE FEEDBACK_ID = ?";
                yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteQuery, [feedbackID], (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
            }
            catch (error) {
                console.error("Error deleting Feedback :", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getFeedbackId(studentId, surveyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("GET FEEDBACK ID ");
                const selectQuery = 'SELECT FEEDBACK_ID FROM FEEDBACK WHERE STUDENT_ID_FK = ? AND SURVEY_ID = ?';
                let feedbackId = null;
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, [studentId, surveyId], (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                            if (result && result.rows && result.rows.length > 0) {
                                feedbackId = result.rows[0][0];
                                console.log("FEEDBACK ID IN MODEL = ", feedbackId);
                            }
                        }
                    });
                });
                return feedbackId;
            }
            catch (error) {
                console.error("Error retrieving feedback ID:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    editFeedback(feedbackID, updateData) {
        throw new Error("Method not implemented.");
    }
}
exports.default = FeedbackSQLServerDB;
