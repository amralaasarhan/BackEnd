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
class AdminSQLServerDB {
    blockUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateQuery = 'UPDATE ENDUSER SET USER_STATUS = ? WHERE USERNAME = ?';
                const userUsername = username;
                const userStatus = "BLOCKED"; // Change status to BLOCKED
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, updateQuery, [userStatus, userUsername], (err, result) => {
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
                console.error("Error updating user status:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getAdminByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Id:', id);
            const selectQuery = 'SELECT * FROM ADMIN WHERE USER_ID_FK = ?';
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
    getAllUsernamesExceptAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Retrieving usernames...');
                const selectQuery = `
              SELECT USERNAME 
              FROM ENDUSER 
              WHERE USER_STATUS = 'ACTIVATED'
              AND EMAIL != 'admin'
          `;
                const results = yield new Promise((resolve, reject) => {
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
                if (results && results.rows && results.rows.length > 0) {
                    const usernames = results.rows.flat().filter((username) => !!username);
                    console.log('Usernames retrieved:', usernames);
                    return usernames;
                }
                else {
                    console.error("No usernames found ");
                    return [];
                }
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
}
exports.default = AdminSQLServerDB;
