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
const TrackIlo_1 = __importDefault(require("./TrackIlo"));
const sql = require("msnodesqlv8");
const bcrypt = require("bcrypt");
const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
class TrackIloSQLServerDB {
    addTrackIlo(trackOutcome, trackType, trackId, trackDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO TRACK_ILO (TRACK_OUTCOME, TRACK_TYPE, TRACK_FK,TRACK_ILO_DESCRIPTION) VALUES (?, ?, ?,?)";
            const insertValues = [trackOutcome, trackType, trackId, trackDescription];
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
    deleteTrackIlo(trackIloId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = "DELETE FROM TRACK_ILO WHERE TRACK_ILO_ID = ?";
                const trackIloToDelete = trackIloId;
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteQuery, [trackIloToDelete], (err, result) => {
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
                console.error("Error deleting Track ILO:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getTrackILOById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Track Ilo Id  entered:', id);
            const selectQuery = 'SELECT * FROM TRACK_ILO WHERE TRACK_ILO_ID = ?';
            const courseToCheck = id;
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
                let trackILO = null;
                if (results && results.rows && results.rows.length > 0) {
                    results.rows.forEach((row) => {
                        trackILO = new TrackIlo_1.default(row[0], row[1], row[2], row[3], row[4]);
                    });
                    console.log('Track ILo  found:', trackILO);
                }
                else {
                    console.error("Track Ilo  is not found:", id);
                }
                return trackILO;
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
    ///////////////////////
    updateTrackIlo(trackIloId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Object.keys(updateData).length || !trackIloId) {
                    throw new Error("No data to update or track id provided.");
                }
                const updateColumnsArray = Object.entries(updateData).map(([column, value]) => {
                    return value ? `${column} = @${column}` : null;
                });
                const updateColumns = updateColumnsArray.filter(column => column !== null).join(', ');
                const updateQuery = `UPDATE TRACK_ILO SET ${updateColumns} WHERE TRACK_ILO_ID = ${trackIloId}`
                    .replace(/@TRACK_OUTCOME/g, `'${updateData.TRACK_OUTCOME}'`)
                    .replace(/@TRACK_TYPE/g, `'${updateData.TRACK_TYPE}'`)
                    .replace(/@TRACK_ILO_DESCRIPTION/g, `'${updateData.TRACK_ILO_DESCRIPTION}'`);
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
    getTrackIloDetails(trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("the sql method is entered");
            try {
                const query = "SELECT * FROM TRACK_ILO WHERE TRACK_FK = ?";
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, query, [trackId], (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                const trackIlos = [];
                if (result && result.rows && result.rows.length > 0) {
                    for (const row of result.rows) {
                        const trackIlo = row;
                        console.log('Track found:', trackIlo);
                        trackIlos.push(trackIlo);
                    }
                }
                else {
                    console.error("No tracks found for id:", trackId);
                }
                return trackIlos;
            }
            catch (error) {
                console.error("Error retrieving Track ILO details:", error);
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
exports.default = TrackIloSQLServerDB;
