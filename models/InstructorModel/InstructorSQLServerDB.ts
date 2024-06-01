import Course from "../CourseModel/Course";
import InstructorDAO from "./InstructorDAO";
import Instructor from "./instructor";
const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
const sql = require("msnodesqlv8");

class InstructorSQLServerDB implements InstructorDAO {
    async addInstructor(id: number): Promise<void> {
        const insertQuery = "INSERT INTO Instructor (USER_ID_FK) VALUES (?)";
        const insertValues = [id];
    
        try {
          const results = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
              if (err) {
                console.error('Error inserting record:', err);
                reject(err);
              } else {
                resolve(results);
              }
            });
          });
        } catch (error) {
          console.error('Error inserting record:', error);
          throw error;
        } finally {
          if (sql && sql.close) {
            await sql.close();
          }
        }    }
    async getInstructorByID(id: number): Promise<Instructor | null> {
        const selectQuery = 'SELECT * FROM INSTRUCTOR WHERE USER_ID_FK = ?';
    const idToCheck = id;

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [idToCheck], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      let user: Instructor | null = null;
      if (results.rows && results.rows[0] && results.rows[0][0]) {
        user = results.rows[0][0];
        console.log("User found in Instructor table");
      } else {
        console.error("User not found in Instructor table");
      }
      return user;
    } catch (error) {
      console.error("Error processing query results:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
    }
    async getAllInstructors(): Promise<Instructor[]> {
        let selectQuery = " SELECT * FROM INSTRUCTOR ";
        try {
            const instructorResults = await new Promise<any>((resolve, reject) => {
                sql.queryRaw(connectionString, selectQuery, (err: any, results: any) => {
                    if (err) {
                        console.error("Error in database query:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
    
            const instructorFK: number[] = instructorResults.rows.map((row: any) => row[2]);
    
            const endUserQuery = `SELECT * FROM ENDUSER WHERE ID IN (${instructorFK.join(',')})`;
    
            const endUserResults = await new Promise<any>((resolve, reject) => {
                sql.queryRaw(connectionString, endUserQuery, (err: any, results: any) => {
                    if (err) {
                        console.error("Error in database query:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
    
            const endUserRecords = endUserResults.rows;
            const instructors: Instructor[] = endUserRecords.map((record: any) => {
                return new Instructor(
                    record[5], // FNAME
                    record[7], // LNAME
                    record[1], // EMAIL
                    record[3], // USERNAME
                    record[4], // PASS
                    record[2], // MOBILE
                    // Other properties based on your constructor
                    "INSTRUCTOR",
                    new Date(record[6]), // DOB
                );
            });
    
            return instructors;
        } catch (error) {
            console.error("Error in main function:", error);
            throw error; // Add this line to throw the error and satisfy TypeScript
        }
    }
    

    deleteInstructor(id: number): void {
        throw new Error("Method not implemented.");
    }
    updateInstructor(InstructorEmail: string, edit: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    assignCourse(id: number, course: Course): Promise<void> {
        throw new Error("Method not implemented.");
    } 
    
}
export default InstructorSQLServerDB;
