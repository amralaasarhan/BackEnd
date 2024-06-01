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
class ExpertSQLServerDB {
    addExpert(id, specialization) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO EXPERT (USER_ID_FK,SPECIALIZATION) VALUES (?,?)";
            const insertValues = [id, specialization];
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, insertQuery, insertValues, (err, results) => {
                        if (err) {
                            console.error('Error inserting record:', err);
                            reject(err);
                        }
                        else {
                            console.log('Query Results:', results);
                            resolve(results);
                        }
                    });
                });
                if (results) {
                    console.log('Record inserted successfully with ID:');
                }
                else {
                    console.error('Failed to retrieve the inserted ID.');
                    throw new Error('Failed to retrieve the inserted ID.');
                }
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
    getExpertByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Id:', id);
            const selectQuery = 'SELECT * FROM EXPERT WHERE USER_ID_FK = ?';
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
                if (results && results.rows && results.rows.length > 0) {
                    user = results.rows[0];
                    console.log('User found:', user);
                }
                else {
                    console.error("User not found ");
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
    getAllExperts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM EXPERT';
                // Execute the query
                const result = yield sql.query(connectionString, query);
                return result.recordset;
            }
            catch (error) {
                console.error("Error getting all users:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    updateExpert(filter, edit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateQuery = `UPDATE EXPERT SET ... WHERE USER_ID_FK = ?`;
                const updateValues = Object.values(edit);
                yield sql.query(connectionString, updateQuery, updateValues);
            }
            catch (error) {
                console.error("Error updating user:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    deleteExpert(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = 'DELETE FROM EXPERT WHERE USER_ID_FK = ?';
                const supervisorId = id;
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteQuery, [supervisorId], (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                console.log("the account is delete from the Supervisor");
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
    getAllExpertsNames() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const selectQuery = `
            SELECT ENDUSER.USERNAME, EXPERT.SPECIALIZATION
            FROM ENDUSER 
            INNER JOIN EXPERT ON ENDUSER.ID = EXPERT.USER_ID_FK
        `;
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (!result || !result.rows || !Array.isArray(result.rows)) {
                            console.error("No rows found in the result:", result);
                            resolve([]); // Return an empty array if no rows are found
                            return;
                        }
                        // Map over the rows to extract expert names and specialization
                        const expertsData = result.rows.map((row) => ({
                            name: row[0],
                            specialization: row[1]
                        }));
                        console.log("Expert Names and Specialization Model:", expertsData);
                        resolve(expertsData);
                    });
                });
                console.log("Retrieved all experts names and specialization:", result);
                return result;
            }
            catch (error) {
                console.error("Error retrieving experts names and specialization:", error);
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
exports.default = ExpertSQLServerDB;
