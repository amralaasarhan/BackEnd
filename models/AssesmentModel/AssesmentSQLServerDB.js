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
const bcrypt = require("bcrypt");
const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
class AssesmentSQLServer {
    addAssesment(assesmentType, courseIloId) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO ASSESSMENT (ASSESSMENT_TYPE, COURSE_ILO_ID_FK) VALUES (?, ?)";
            const insertValues = [assesmentType, courseIloId];
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
    addAssesmentQuestion(assesmentId, question, questionType, questionLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO ASSESSMENT_QUESTIONS (ASSESSMENT_ID_FK, QUESTION, QUESTION_TYPE, QUESTION_LEVEL) VALUES (?, ?, ?, ? )";
            const insertValues = [
                assesmentId,
                question,
                questionType,
                questionLevel
            ];
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
    addAnswer(assesmentQuestionId, answerText, correctAnswer) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO POSSIBLE_ANSWERS (A_QUESTION_ID_FK, ANSWER_TEXT, CORRECT_ANSWER) VALUES (?, ?, ?)";
            const insertValues = [assesmentQuestionId, answerText, correctAnswer];
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
    addAssesmentQuestionAndCourseTopic(assesmentQuestionId, courseTopicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO COURSE_TOPIC_ASSESSMENT_QUESTIONS (A_QUESTION_ID, COURSE_TOPIC_ID) VALUES (?, ?)";
            const insertValues = [assesmentQuestionId, courseTopicId];
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
    deleteAssesment(assesmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = "DELETE FROM ASSESSMENT WHERE ASSESSMENT_ID = ?";
                const assesmentToDelete = assesmentId;
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteQuery, [assesmentToDelete], (err, result) => {
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
                console.error("Error deleting Assesment:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    deleteAssesmentQuestion(assesmentQuestionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = "DELETE FROM ASSESSMENT_QUESTIONS WHERE A_QUESTION_ID = ?";
                const assesmentQuestionToDelete = assesmentQuestionId;
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteQuery, [assesmentQuestionToDelete], (err, result) => {
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
                console.error("Error deleting Assesment Question:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    deleteAnswer(answerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = "DELETE FROM POSSIBLE_ANSWERS WHERE ANSWER_ID = ?";
                const answerToDelete = answerId;
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteQuery, [answerToDelete], (err, result) => {
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
                console.error("Error deleting Answer:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getAssessments() {
        return __awaiter(this, void 0, void 0, function* () {
            const selectQuery = "SELECT * FROM ASSESSMENT";
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.query(connectionString, selectQuery, (err, rows) => {
                        if (err) {
                            console.error("Error fetching assessment :", err);
                            reject(err);
                        }
                        else {
                            console.log("Query Results:", rows);
                            resolve(rows);
                        }
                    });
                });
                return results;
            }
            catch (error) {
                console.error("Error fetching assessment:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getAssessmentByCourseIloId(courseIloId) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectQuery = "SELECT * FROM ASSESSMENT WHERE COURSE_ILO_ID_FK = ?";
            const CourseIloId = courseIloId;
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.query(connectionString, selectQuery, [courseIloId], (err, rows) => {
                        if (err) {
                            console.error("Error fetching assessment by course ilo ID:", err);
                            reject(err);
                        }
                        else {
                            console.log("Query Results:", rows);
                            resolve(rows);
                        }
                    });
                });
                return results;
            }
            catch (error) {
                console.error("Error fetching assessment  by course ID:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getAssessmentQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            const selectQuery = "SELECT * FROM ASSESSMENT_QUESTIONS";
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.query(connectionString, selectQuery, (err, rows) => {
                        if (err) {
                            console.error("Error fetching assessment questions:", err);
                            reject(err);
                        }
                        else {
                            console.log("Query Results:", rows);
                            resolve(rows);
                        }
                    });
                });
                return results;
            }
            catch (error) {
                console.error("Error fetching assessment questions:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getAssessmentQuestionsByAssessmentId(assesmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectQuery = "SELECT * FROM ASSESSMENT_QUESTIONS WHERE ASSESSMENT_ID_FK = ?";
            const assesmentid = assesmentId;
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.query(connectionString, selectQuery, [assesmentid], (err, rows) => {
                        if (err) {
                            console.error("Error fetching assessment questions by assessment ID:", err);
                            reject(err);
                        }
                        else {
                            console.log("Query Results:", rows);
                            resolve(rows);
                        }
                    });
                });
                return results;
            }
            catch (error) {
                console.error("Error fetching assessment questions by assessment ID:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getAnswerByAssessmentQuestionId(assesmentQuestionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectQuery = "SELECT * FROM POSSIBLE_ANSWERS WHERE A_QUESTION_ID_FK = ?";
            const AssesmentQuestionId = assesmentQuestionId;
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.query(connectionString, selectQuery, [AssesmentQuestionId], (err, rows) => {
                        if (err) {
                            console.error("Error fetching answer  by assessment questions ID:", err);
                            reject(err);
                        }
                        else {
                            console.log("Query Results:", rows);
                            resolve(rows);
                        }
                    });
                });
                return results;
            }
            catch (error) {
                console.error("Error fetching answer  by assessment questions ID:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    uploadAssessmentFile(filename, fileData) {
        throw new Error("Method not implemented.");
    }
}
exports.default = AssesmentSQLServer;
