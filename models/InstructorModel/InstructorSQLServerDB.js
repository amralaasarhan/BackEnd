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
const instructor_1 = __importDefault(require("./instructor"));
const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
const sql = require("msnodesqlv8");
class InstructorSQLServerDB {
    addInstructor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO Instructor (USER_ID_FK) VALUES (?)";
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
    getInstructorByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectQuery = 'SELECT * FROM INSTRUCTOR WHERE USER_ID_FK = ?';
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
                    console.log("User found in Instructor table");
                }
                else {
                    console.error("User not found in Instructor table");
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
    getAllInstructors() {
        return __awaiter(this, void 0, void 0, function* () {
            let selectQuery = " SELECT * FROM INSTRUCTOR ";
            try {
                const instructorResults = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                const instructorFK = instructorResults.rows.map((row) => row[2]);
                const endUserQuery = `SELECT * FROM ENDUSER WHERE ID IN (${instructorFK.join(',')})`;
                const endUserResults = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, endUserQuery, (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                const endUserRecords = endUserResults.rows;
                const instructors = endUserRecords.map((record) => {
                    return new instructor_1.default(record[5], // FNAME
                    record[7], // LNAME
                    record[1], // EMAIL
                    record[3], // USERNAME
                    record[4], // PASS
                    record[2], // MOBILE
                    // Other properties based on your constructor
                    "INSTRUCTOR", new Date(record[6]));
                });
                return instructors;
            }
            catch (error) {
                console.error("Error in main function:", error);
                throw error; // Add this line to throw the error and satisfy TypeScript
            }
        });
    }
    deleteInstructor(id) {
        throw new Error("Method not implemented.");
    }
    updateInstructor(InstructorEmail, edit) {
        throw new Error("Method not implemented.");
    }
    assignCourse(id, course) {
        throw new Error("Method not implemented.");
    }
}
exports.default = InstructorSQLServerDB;
