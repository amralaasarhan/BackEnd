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
class StudentSQLServerDB {
    addStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO STUDENT (USER_ID_FK) VALUES (?)";
            const insertValues = [id];
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, insertQuery, insertValues, (err, results) => {
                        if (err) {
                            console.error('Error inserting record:', err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
            }
            catch (error) {
                console.error('Error inserting record:', error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    /////////////////////////////////
    getStudentByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Id:', id);
            const selectQuery = 'SELECT * FROM STUDENT WHERE USER_ID_FK = ?';
            const idToCheck = id;
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, [idToCheck], (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                let user = null;
                if (results.rows && results.rows[0] && results.rows[0][0]) {
                    user = results.rows[0][0];
                    console.log("User found in student table");
                }
                else {
                    console.error("User not found in student table");
                }
                return user;
            }
            catch (error) {
                console.error("Error processing query results:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    /////////////////////////////////
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM INSTRUCTOR';
                // Execute the query
                const result = yield sql.query(connectionString, query);
                return result.recordset;
            }
            catch (error) {
                console.error("Error getting all users:", error.message);
                throw error;
            }
            finally {
                yield sql.close();
            }
        });
    }
    /////////////////////////////////
    updateStudent(filter, edit) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /////////////////////////////////
    deleteStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = 'DELETE FROM STUDENT WHERE USER_ID_FK = ?';
                const studentId = id;
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteQuery, [studentId], (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                console.log("the account is delete from the student");
            }
            catch (error) {
                console.error("Error deleting user:", error.message);
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
///////////////////////
exports.default = StudentSQLServerDB;
