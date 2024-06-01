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
class SurveyQuestionSQLServerDB {
    addQuestion(question) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO SURVEY_QUESTIONS (SURVEY_ID, QUESTION, Q_TYPE) VALUES (?, ?, ?)";
            const insertValues = [question.surveyID, question.question, question.q_type];
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, insertQuery, insertValues, (err, results) => {
                        if (err) {
                            console.error('Error inserting survey question record:', err);
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
                console.error('Error inserting survey question record:', error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    editQuestion(questionId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield new Promise((resolve, reject) => {
                    sql.query(connectionString, updateQuery, params, (err, results) => {
                        if (err) {
                            console.error("Error updating survey question:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
            }
            catch (error) {
                console.error("Error updating survey question:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    deleteQuestion(questionID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = 'DELETE FROM SURVEY_QUESTIONS WHERE QUESTION_ID = ?';
                const deleteValues = [questionID];
                // Execute the deletion query
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteQuery, deleteValues, (err) => {
                        if (err) {
                            console.error('Error deleting question:', err);
                            reject(err);
                        }
                        else {
                            console.log('Question deleted successfully.');
                            resolve();
                        }
                    });
                });
            }
            catch (error) {
                console.error('Error deleting question:', error);
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
exports.default = SurveyQuestionSQLServerDB;
