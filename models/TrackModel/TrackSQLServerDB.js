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
const Track_1 = __importDefault(require("./Track"));
const sql = require("msnodesqlv8");
const bcrypt = require('bcrypt');
const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
class TrackSQLServerDB {
    addTrack(trackTitle, trackDescription, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO TRACK (TRACK_TITLE, TRACK_DESCRIPTION, PATH_SUPERVISOR_ID_FK) VALUES (?, ?, ?)";
            const insertValues = [trackTitle, trackDescription, id];
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
    getTrackByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Title entered:', title);
            const selectQuery = 'SELECT * FROM TRACK WHERE TRACK_TITLE = ?';
            const titleToCheck = title;
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, [titleToCheck], (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                let track = null;
                if (results && results.rows && results.rows.length > 0) {
                    // Provide the trackImage argument
                    track = new Track_1.default(results.rows[0][0], results.rows[0][1], results.rows[0][2], results.rows[0][3]);
                    console.log('Track found:', track);
                }
                else {
                    console.error("Track not found for title:", title);
                }
                return track;
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
    getTracksByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Query entered:', title);
            const selectQuery = 'SELECT * FROM TRACK WHERE TRACK_TITLE LIKE ?';
            const queryToCheck = `%${title}%`;
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, [queryToCheck], (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                const tracks = [];
                if (results && results.rows && results.rows.length > 0) {
                    results.rows.forEach((row) => {
                        // Provide the trackImage argument
                        const track = new Track_1.default(row[0], row[1], row[2], row[3]);
                        tracks.push(track);
                    });
                    console.log('Tracks found:', tracks);
                }
                else {
                    console.error("No tracks found for the query:", title);
                }
                return tracks;
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
    //////////////////////////////////////////////////////////////
    getTrackById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('ID entered:', id);
            const selectQuery = 'SELECT * FROM TRACK WHERE TRACK_ID = ?';
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
                let track = null;
                if (results && results.rows && results.rows.length > 0) {
                    // Provide the trackImage argument
                    track = new Track_1.default(results.rows[0][0], results.rows[0][1], results.rows[0][2], results.rows[0][3]);
                    console.log('Track found:', track);
                }
                else {
                    console.error("Track not found for id:", id);
                }
                return track;
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
    getAllTracksByPathSupervisorId(pathSupervisorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const selectQuery = 'SELECT * FROM TRACK WHERE PATH_SUPERVISOR_ID_FK =?';
                try {
                    const results = yield new Promise((resolve, reject) => {
                        sql.queryRaw(connectionString, selectQuery, [pathSupervisorId], (err, results) => {
                            if (err) {
                                console.error("Error in database query:", err);
                                reject(err);
                            }
                            else {
                                resolve(results);
                            }
                        });
                    });
                    const tracks = [];
                    if (results && results.rows && results.rows.length > 0) {
                        results.rows.forEach((row) => {
                            const track = new Track_1.default(row[0], row[1], row[2], row[3]);
                            tracks.push(track);
                        });
                    }
                    else {
                        console.error("No tracks found for this supervisor.");
                    }
                    return tracks;
                }
                catch (error) {
                    console.error("Error getting Tracks by PATH_SUPERVISOR_ID_FK:", error.message);
                    throw error;
                }
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getRegisterdTracks(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const selectQuery = `
      SELECT TRACK.TRACK_ID, TRACK.TRACK_TITLE, TRACK.TRACK_DESCRIPTION
      FROM STUDENT_TRACK
      JOIN TRACK ON STUDENT_TRACK.TRACK_ID_FK = TRACK.TRACK_ID
      WHERE STUDENT_TRACK.STUDENT_ID_FK = (
          SELECT STUDENT_ID
          FROM STUDENT
          WHERE USER_ID_FK = ?
      )`;
                /*const selectQuery = `SELECT TRACK.TRACK_ID, TRACK.TRACK_TITLE, TRACK.TRACK_DESCRIPTION
                FROM STUDENT_TRACK
                JOIN TRACK ON STUDENT_TRACK.TRACK_ID_FK = TRACK.TRACK_ID
                WHERE STUDENT_TRACK.STUDENT_ID_FK = ?`;*/
                try {
                    const results = yield new Promise((resolve, reject) => {
                        sql.queryRaw(connectionString, selectQuery, [studentId], (err, results) => {
                            if (err) {
                                console.error("Error in database query:", err);
                                reject(err);
                            }
                            else {
                                resolve(results);
                            }
                        });
                    });
                    const tracks = [];
                    if (results && results.rows && results.rows.length > 0) {
                        results.rows.forEach((row) => {
                            const track = new Track_1.default(row[0], row[1], row[2], row[3]);
                            tracks.push(track);
                        });
                        console.log('Tracks found:', tracks);
                    }
                    else {
                        console.error("No tracks found .");
                    }
                    return tracks;
                }
                catch (error) {
                    console.error("Error getting Tracks:", error.message);
                    throw error;
                }
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    ////////////////////////////////////////////////////////////
    getAllTracks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const selectQuery = 'SELECT * FROM TRACK ';
                try {
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
                    const tracks = [];
                    if (results && results.rows && results.rows.length > 0) {
                        results.rows.forEach((row) => {
                            const track = new Track_1.default(row[0], row[1], row[2], row[3]);
                            tracks.push(track);
                        });
                        console.log('Tracks found:', tracks);
                    }
                    else {
                        console.error("No tracks found .");
                    }
                    return tracks;
                }
                catch (error) {
                    console.error("Error getting Tracks:", error.message);
                    throw error;
                }
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    ///////////////////////////////////////////////////////////////
    updateTrack(trackTitle, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Object.keys(updateData).length || !trackTitle) {
                    throw new Error("No data to update or track title provided.");
                }
                const updateColumnsArray = Object.entries(updateData).map(([column, value]) => {
                    return value ? `${column} = '${value}'` : null;
                });
                const updateColumns = updateColumnsArray.filter(column => column !== null).join(', ');
                const updateQuery = `UPDATE dbo.TRACK SET ${updateColumns} WHERE TRACK_TITLE = '${trackTitle}'`;
                console.log('Generated Query:', updateQuery);
                // Execute the query directly
                yield new Promise((resolve, reject) => {
                    sql.query(connectionString, updateQuery, (err, results) => {
                        if (err) {
                            console.error("Error updating TRACK:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
            }
            catch (error) {
                console.error("Error updating track:", error);
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
    deleteTrack(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = 'DELETE FROM TRACK WHERE TRACK_TITLE = ?';
                const trackTitle = title;
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteQuery, [trackTitle], (err, result) => {
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
                console.error("Error deleting TRACK:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getTrackByNameQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Query entered:', query);
            const selectQuery = 'SELECT * FROM TRACK WHERE TRACK_TITLE LIKE ?';
            const queryToCheck = `${query}%`;
            console.log(queryToCheck);
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, [queryToCheck], (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                const tracks = [];
                if (results && results.rows && results.rows.length > 0) {
                    results.rows.forEach((row) => {
                        // Provide the trackImage argument
                        const track = new Track_1.default(row[0], row[1], row[2], row[3]);
                        tracks.push(track);
                    });
                    console.log('Tracks found:', tracks);
                }
                else {
                    console.error("No tracks found for the query:", query);
                }
                return tracks;
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
    addStudentToTrack(stdId, trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO STUDENT_TRACK (STUDENT_ID_FK, TRACK_ID_FK) VALUES (?, ?)";
            const insertValues = [stdId, trackId];
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, insertQuery, insertValues, (err, results) => {
                        if (err) {
                            console.error('Error inserting registering student to track :', err);
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
                console.error('Error inserting registering student to track:', error);
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
exports.default = TrackSQLServerDB;
