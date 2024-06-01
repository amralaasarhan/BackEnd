import CourseIloDAO from "./CourseIloDAO";
import CourseIlo from "./CourseIlo";
const sql = require("msnodesqlv8");
const bcrypt = require("bcrypt");

const connectionString =
  "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class CourseIloSQLServerDB implements CourseIloDAO {
  
  async addCourseIlo(courseOutcome: string, courseType: string, courseId: number, courseIloDescription: string): Promise<void> {
    const insertQuery =
      "INSERT INTO COURSE_ILO (COURSE_OUTCOME, COURSE_TYPE, COURSE_ID_FK,COURSE_ILO_DESCRIPTION) VALUES (?, ?, ?,?)";
    const insertValues = [courseOutcome, courseType, courseId, courseIloDescription];

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(
          connectionString,
          insertQuery,
          insertValues,
          (err: any, results: any) => {
            if (err) {
              console.error("Error inserting record:", err);
              reject(err);
            } else {
              console.log("Query Results:", results);
              resolve(results);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error inserting record:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
  ///////////////////////////////
  async deleteCourseIlo(courseIloId: number): Promise<void> {
    try {
      const deleteQuery = "DELETE FROM COURSE_ILO WHERE COURSE_ILO_ID = ?";
      const courseIloToDelete = courseIloId;
      const result = await new Promise((resolve, reject) => {
        sql.queryRaw(connectionString, deleteQuery, [courseIloToDelete], (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
        );
      });
    } catch (error) {
      console.error("Error deleting Course ILO:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  ///////////////////////
  async updateCourseIlo(courseIloId: number, updateData: any): Promise<void> {
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
        .replace(/@COURSE_ILO_DESCRIPTION/g, `'${updateData.COURSE_ILO_DESCRIPTION}'`)



      console.log("Generated Query:", updateQuery);


      await new Promise((resolve, reject) => {
        sql.query(connectionString, updateQuery, (err: any, results: any) => {
          if (err) {
            console.error("Error updating Course_ILO:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.error("Error updating Course ILO:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async addCourseIloWeight(courseId: number, weight: number, courseILOId: number): Promise<void> {
    console.log("Entering the method addCourseWeight");
    try {
      const insertQuery = `UPDATE COURSE_ILO SET WEIGHT = ? WHERE COURSE_ILO_ID = ? AND COURSE_ID_FK = ?`;
      const insertValues = [weight, courseILOId, courseId];

      try {
        await new Promise<void>((resolve, reject) => {
          sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
            if (err) {
              console.error('Error updating record:', err);
              reject(err);
            } else {
              console.log('Query Results:', results);
              resolve();
            }
          });
        });
      } catch (error) {
        console.error('Error updating record:', error);
        throw error;
      } finally {
        if (sql && sql.close) {
          await sql.close();
        }
      }
    } catch (error) {
      console.error('Error adding course weight:', error);
      throw error;
    }
  }













  async getCourseIloDetails(courseId: number): Promise<CourseIlo[]> {
    console.log("the sql method is entered");
    try {
      const query = "SELECT * FROM COURSE_ILO WHERE COURSE_ID_FK = ?";
      const result = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, query, [courseId], (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      const courseIloArray: CourseIlo[] = [];
      if (result && result.rows && result.rows.length > 0) {
        for (const row of result.rows) {
          const courseIlo: CourseIlo = row;
          console.log('courseIlo found:', courseIlo);
          courseIloArray.push(courseIlo);
        }
        console.log('Courses found:', courseIloArray);
      } else {
        console.error("No courses found for id:", courseId);
      }

      return courseIloArray;
    } catch (error) {
      console.error("Error retrieving Course ILO details:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async getAllWeightsWithCourseId(courseId: number): Promise<number> {
    console.log("Entering the method getAllWeightsWithCourseId");
    try {
      const selectQuery = 'SELECT * FROM COURSE_ILO WHERE COURSE_ID_FK = ?';
      const selectValues = [courseId];

      try {
        const results = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, selectQuery, selectValues, (err: any, results: any) => {
            if (err) {
              console.error('Error executing query:', err);
              reject(err);
            } else {
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
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      } finally {
        if (sql && sql.close) {
          await sql.close();
        }
      }
    } catch (error) {
      console.error('Error in getAllWeightsWithTrackIlo:', error);
      throw error;
    }
  }

  
}

export default CourseIloSQLServerDB
