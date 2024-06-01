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
const bcrypt = require('bcrypt');
const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
class UserSQLServerDB {
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO ENDUSER (EMAIL, PASS, FNAME, DOB, LNAME, MOBILE, USERNAME) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const insertValues = [user.email, user.pass, user.fName, user.DOB, user.lName, user.mobile, user.username];
            try {
                // Insert into ENDUSER table
                const endUserInsertResult = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, insertQuery, insertValues, (err, results) => {
                        if (err) {
                            console.error('Error inserting record into ENDUSER:', err);
                            reject(err);
                        }
                        else {
                            console.log('Record inserted into ENDUSER:', results);
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
    ///////////////////////////////////////////////////////////////
    login(email, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Email entered:', email);
            console.log("Pass", pass);
            const selectQuery = 'SELECT * FROM ENDUSER WHERE EMAIL = ?';
            const emailToCheck = email;
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, [emailToCheck], (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            console.log('Query Results:', results);
                            resolve(results);
                        }
                    });
                });
                let user = null;
                let userId = null;
                if (results && results.rows && results.rows.length > 0) {
                    user = results.rows[0];
                    console.log('User found:', user);
                    userId = results.rows[0][0];
                    console.log('ID:', userId);
                }
                else {
                    console.error("User not found for email:", email);
                }
                return { user, userId };
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
    ///////////////////////////////////////////////////////////////
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Email entered:', email);
            const selectQuery = 'SELECT * FROM  ENDUSER WHERE EMAIL = ?';
            const emailToCheck = email;
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, [emailToCheck], (err, results) => {
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
                    console.error("User not found for email:", email);
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
    ///////////////////////////////////////////////////////////////
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Username entered:', username);
            const selectQuery = 'SELECT * FROM ENDUSER WHERE USERNAME = ?';
            const usernameToCheck = username;
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, [usernameToCheck], (err, results) => {
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
                    user = results.rows[0]; // Assuming the first row contains the user data
                    console.log('User found:', user);
                }
                else {
                    console.error("User not found for username:", username);
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
    ///////////////////////////////////////////////////////////////
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Construct a query to retrieve all users
                const query = 'SELECT * FROM ENDUSER';
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
    ///////////////////////////////////////////////////////////////
    updateUser(filter, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Object.keys(updateData).length || !Object.keys(filter).length) {
                    throw new Error("No columns to update or filter provided.");
                }
                const updateColumnsArray = Object.entries(updateData).map(([column, value]) => {
                    return value ? `${column} = @${column}` : null;
                });
                const updateColumns = updateColumnsArray.filter(column => column !== null).join(', ');
                const whereClause = Object.keys(filter).map(column => `${column} = @${column}`).join(' AND ');
                const updateQuery = `UPDATE ENDUSER SET ${updateColumns} WHERE ${whereClause}`
                    .replace(/@USERNAME/g, `'${updateData.USERNAME}'`)
                    .replace(/@LNAME/g, `'${updateData.LNAME}'`)
                    .replace(/@FNAME/g, `'${updateData.FNAME}'`)
                    .replace(/@MOBILE/g, `'${updateData.MOBILE}'`)
                    .replace(/@DOB/g, `'${updateData.DOB}'`)
                    .replace(/@PASS/g, `'${updateData.PASS}'`)
                    .replace(/@EMAIL/g, `'${filter.EMAIL}'`);
                console.log('Generated Query:', updateQuery);
                // Execute the query directly
                yield new Promise((resolve, reject) => {
                    sql.query(connectionString, updateQuery, (err, results) => {
                        if (err) {
                            console.error("Error updating user:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
            }
            catch (error) {
                console.error("Error updating user:", error);
                throw error;
            }
            finally {
                // Close the SQL connection (if applicable)
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    ///////////////////////////////////////////////////////////////
    deleteUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateQuery = 'UPDATE ENDUSER SET USER_STATUS = ? WHERE EMAIL = ?';
                const userEmail = email;
                const userStatus = "DELETED";
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, updateQuery, [userStatus, userEmail], (err, result) => {
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
}
exports.default = UserSQLServerDB;
