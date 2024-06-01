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
class CompanyRepresenativeSQLServerDB {
    addCompanyRepresenative(id, companyName) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO COMPANY_REPRESENTATIVE (USER_ID_FK,COMPANY_NAME) VALUES (?,?)";
            const insertValues = [id, companyName];
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
    getCompanyRepresenativeByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Id:', id);
            const selectQuery = 'SELECT * FROM COMPANY_REPRESENTATIVE WHERE USER_ID_FK = ?';
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
    getAllCompanyRepresenatives() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM COMPANY_REPRESENTATIVE';
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
    updateCompanyRepresenative(filter, edit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateQuery = `UPDATE COMPANY_REPRESENTATIVE SET ... WHERE USER_ID_FK = ?`;
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
    deleteCompanyRepresenative(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = 'DELETE FROM COMPANY_REPRESENTATIVE WHERE USER_ID_FK = ?';
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
                console.log("the account is delete from the COMPANY_REPRESENTATIVE");
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
exports.default = CompanyRepresenativeSQLServerDB;
