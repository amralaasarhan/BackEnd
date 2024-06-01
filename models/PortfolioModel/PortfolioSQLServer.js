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
class PortfolioSQLServer {
    addPortfolio(portfolio) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO PORTFOLIO (EDUCATION_DEGREE, ACADEMIC_INSTITUTE, TECHNICAL_SKILLS, PORTFOLIO_DESCRIPTION, EXPERIENCE, STUDENT_ID_FK) VALUES (?, ?, ?, ?, ?, ?)";
            const insertValues = [portfolio.educationDegree, portfolio.academicInstitute, portfolio.technicalSkills, portfolio.description, portfolio.experience, portfolio.studentID];
            try {
                yield new Promise((resolve, reject) => {
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
                // If the operation reaches this point, it means the insertion was successful.
                return true;
            }
            catch (error) {
                console.error('Error inserting record:', error);
                // Return false indicating failure.
                return false;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    deletePortfolio(STUDENT_ID_FK) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuery = 'DELETE FROM PORTFOLIO WHERE STUDENT_ID_FK = ?';
                const studentID = STUDENT_ID_FK;
                const result = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, deleteQuery, [studentID], (err, result) => {
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
                console.error("Error deleting Portfolio:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    updatePortfolio(filter, updateData) {
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
                const updateQuery = `UPDATE PORTFOLIO SET ${updateColumns} WHERE ${whereClause}`
                    .replace(/@EDUCATION_DEGREE/g, `'${updateData.EDUCATION_DEGREE}'`)
                    .replace(/@ACADEMIC_INSTITUTE/g, `'${updateData.ACADEMIC_INSTITUTE}'`)
                    .replace(/@TECHNICAL_SKILLS/g, `'${updateData.TECHNICAL_SKILLS}'`)
                    .replace(/@PORTFOLIO_DESCRIPTION/g, `'${updateData.PORTFOLIO_DESCRIPTION}'`)
                    .replace(/@EXPERIENCE/g, `'${updateData.EXPERIENCE}'`)
                    .replace(/@STUDENT_ID_FK/g, `'${filter.STUDENT_ID_FK}'`);
                console.log('Generated Query:', updateQuery);
                // Execute the query directly
                yield new Promise((resolve, reject) => {
                    sql.query(connectionString, updateQuery, (err, results) => {
                        if (err) {
                            console.error("Error updating portfolio:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
            }
            catch (error) {
                console.error("Error updating portfolio:", error);
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
    getPortfolio(id) {
        throw new Error("Method not implemented.");
    }
    getAllPortfolios() {
        throw new Error("Method not implemented.");
    }
    searchPortfolios(filter) {
        throw new Error("Method not implemented.");
    }
}
exports.default = PortfolioSQLServer;
