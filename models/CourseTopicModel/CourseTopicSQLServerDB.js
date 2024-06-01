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
const CourseTopic_1 = __importDefault(require("./CourseTopic"));
const sql = require("msnodesqlv8");
const bcrypt = require("bcrypt");
const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
class CourseTopicSQLServerDB {
    addCourseTopic(topicName, courseId, courseIloId) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO COURSE_TOPIC (TOPIC_NAME,COURSE_ID_FK,COURSE_ILO_ID_FK) VALUES (?, ?,?)";
            const insertValues = [topicName, courseId, courseIloId];
            try {
                // Execute the insertion query
                yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, insertQuery, insertValues, (err, results) => {
                        if (err) {
                            console.error("Error inserting record:", err);
                            reject(err);
                        }
                        else {
                            console.log("Inserted Course Topic ID:", results.identity);
                            resolve(results.identity);
                        }
                    });
                });
                // Fetch the inserted course topic from the database to get its ID
                const selectQuery = "SELECT * FROM COURSE_TOPIC WHERE TOPIC_NAME = ?";
                const selectValues = [topicName];
                const courseTopic = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, selectValues, (err, results) => {
                        if (err) {
                            console.error("Error fetching inserted record:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                return courseTopic; // Return the created course topic along with its ID
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
    getCourseTopicsDetails(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(" getCourseTopicsDetails  sql method is entered");
            try {
                const query = "SELECT * FROM COURSE_TOPIC WHERE COURSE_ID_FK = ?";
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
                const courseTopicsArray = [];
                if (result && result.rows && result.rows.length > 0) {
                    for (const row of result.rows) {
                        const courseTopic = row;
                        console.log('courseTopic found:', courseTopic);
                        courseTopicsArray.push(courseTopic);
                    }
                    console.log('courseTopics found:', courseTopicsArray);
                }
                else {
                    console.error("No courseTopics found for id:", courseId);
                }
                return courseTopicsArray;
            }
            catch (error) {
                console.error("Error retrieving courseTopics details:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getCourseTopicByTopicName(topicName) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('CourseTopicName entered:', topicName);
            const selectQuery = 'SELECT * FROM COURSE_TOPIC WHERE TOPIC_NAME  = ?';
            const courseToCheck = topicName;
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, [courseToCheck], (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                let courseTopic = null;
                if (results && results.rows && results.rows.length > 0) {
                    results.rows.forEach((row) => {
                        courseTopic = new CourseTopic_1.default(row[0], row[1], row[2], row[3]);
                    });
                    console.log('Course found:', courseTopic);
                }
                else {
                    console.error("Course is not found:", topicName);
                }
                return courseTopic;
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
    updateCourseTopic(courseTopicId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Object.keys(updateData).length || !courseTopicId) {
                    throw new Error("No data to update or course topic ID provided.");
                }
                const parsedUpdateData = JSON.parse(updateData);
                const updateColumnsArray = Object.entries(parsedUpdateData).map(([column, value]) => {
                    return value ? `[${column}] = '${value}'` : null;
                });
                console.log('Update Columns Array:', updateColumnsArray);
                const updateColumns = updateColumnsArray.filter(column => column !== null).join(', ');
                const updateQuery = `UPDATE COURSE_TOPIC SET ${updateColumns} WHERE COURSE_TOPIC_ID = ${courseTopicId}`;
                console.log('Generated Query:', updateQuery);
                // Execute the query directly
                yield new Promise((resolve, reject) => {
                    sql.query(connectionString, updateQuery, (err, results) => {
                        if (err) {
                            console.error("Error updating COURSE_TOPIC:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
            }
            catch (error) {
                console.error("Error updating course topic:", error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    deleteCourseTopic(courseTopicId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Hi method 1 entered");
                const deleteQuery = "DELETE FROM COURSE_TOPIC WHERE COURSE_TOPIC_ID = ?";
                const courseTopicToDelete = courseTopicId;
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteQuery, [courseTopicToDelete], (err, result) => {
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
                console.error("Error deleting Course Topic:", error.message);
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
exports.default = CourseTopicSQLServerDB;
