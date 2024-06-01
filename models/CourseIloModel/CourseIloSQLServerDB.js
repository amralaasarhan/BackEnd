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
class CourseIloSQLServerDB {
    addCourseIlo(courseOutcome, courseType, courseId, courseIloDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO COURSE_ILO (COURSE_OUTCOME, COURSE_TYPE, COURSE_ID_FK,COURSE_ILO_DESCRIPTION) VALUES (?, ?, ?,?)";
            const insertValues = [courseOutcome, courseType, courseId, courseIloDescription];
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
    ///////////////////////////////
    deleteCourseIlo(courseIloId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = "DELETE FROM COURSE_ILO WHERE COURSE_ILO_ID = ?";
                const courseIloToDelete = courseIloId;
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteQuery, [courseIloToDelete], (err, result) => {
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
                console.error("Error deleting Course ILO:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    ///////////////////////
    updateCourseIlo(courseIloId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Object.keys(updateData).length || !courseIloId) {
                    throw new Error("No data to update or track id provided.");
                }
                const updateColumnsArray = Object.entries(updateData).map(([column, value]) => {
                    return value ? `${column} = '${value}'` : null;
                });
                const updateColumns = updateColumnsArray.filter(column => column !== null).join(', ');
                const updateQuery = `UPDATE COURSE_ILO SET ${updateColumns} WHERE COURSE_ILO_ID = ${courseIloId}`
                    .replace(/@COURSE_OUTCOME/g, `'${updateData.COURSE_OUTCOME}'`)
                    .replace(/@COURSE_TYPE/g, `'${updateData.COURSE_TYPE}'`)
                    .replace(/@WEIGHT/g, `'${updateData.WEIGHT}'`)
                    .replace(/@COURSE_ILO_DESCRIPTION/g, `'${updateData.COURSE_ILO_DESCRIPTION}'`);
                console.log("Generated Query:", updateQuery);
                yield new Promise((resolve, reject) => {
                    sql.query(connectionString, updateQuery, (err, results) => {
                        if (err) {
                            console.error("Error updating Course_ILO:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
            }
            catch (error) {
                console.error("Error updating Course ILO:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    addCourseIloWeight(courseId, weight, courseILOId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entering the method addCourseWeight");
            try {
                const insertQuery = `UPDATE COURSE_ILO SET WEIGHT = ? WHERE COURSE_ILO_ID = ? AND COURSE_ID_FK = ?`;
                const insertValues = [weight, courseILOId, courseId];
                try {
                    yield new Promise((resolve, reject) => {
                        sql.queryRaw(connectionString, insertQuery, insertValues, (err, results) => {
                            if (err) {
                                console.error('Error updating record:', err);
                                reject(err);
                            }
                            else {
                                console.log('Query Results:', results);
                                resolve();
                            }
                        });
                    });
                }
                catch (error) {
                    console.error('Error updating record:', error);
                    throw error;
                }
                finally {
                    if (sql && sql.close) {
                        yield sql.close();
                    }
                }
            }
            catch (error) {
                console.error('Error adding course weight:', error);
                throw error;
            }
        });
    }
    getCourseIloDetails(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("the sql method is entered");
            try {
                const query = "SELECT * FROM COURSE_ILO WHERE COURSE_ID_FK = ?";
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, query, [courseId], (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                const courseIloArray = [];
                if (result && result.rows && result.rows.length > 0) {
                    for (const row of result.rows) {
                        const courseIlo = row;
                        console.log('courseIlo found:', courseIlo);
                        courseIloArray.push(courseIlo);
                    }
                    console.log('Courses found:', courseIloArray);
                }
                else {
                    console.error("No courses found for id:", courseId);
                }
                return courseIloArray;
            }
            catch (error) {
                console.error("Error retrieving Course ILO details:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getAllWeightsWithCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entering the method getAllWeightsWithCourseId");
            try {
                const selectQuery = 'SELECT * FROM COURSE_ILO WHERE COURSE_ID_FK = ?';
                const selectValues = [courseId];
                try {
                    const results = yield new Promise((resolve, reject) => {
                        sql.queryRaw(connectionString, selectQuery, selectValues, (err, results) => {
                            if (err) {
                                console.error('Error executing query:', err);
                                reject(err);
                            }
                            else {
                                console.log('Query Results:', results);
                                resolve(results);
                            }
                        });
                    });
                    let sum = 0;
                    if (results && results.rows && results.rows.length > 0) {
                        // Extract weights from results array and sum them
                        for (const row of results.rows) {
                            console.log("Row Weight: ", row[5]);
                            sum += row[5];
                        }
                    }
                    console.log("Total Sum of weight:", sum);
                    return sum;
                }
                catch (error) {
                    console.error('Error executing query:', error);
                    throw error;
                }
                finally {
                    if (sql && sql.close) {
                        yield sql.close();
                    }
                }
            }
            catch (error) {
                console.error('Error in getAllWeightsWithTrackIlo:', error);
                throw error;
            }
        });
    }
}
exports.default = CourseIloSQLServerDB;
