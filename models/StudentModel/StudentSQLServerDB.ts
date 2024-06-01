import Student from "./Student";
import StudentDAO from "./StudentDAO";

const sql = require("msnodesqlv8");

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class StudentSQLServerDB implements StudentDAO {

  async addStudent(id: number): Promise<void> {
    const insertQuery = "INSERT INTO STUDENT (USER_ID_FK) VALUES (?)";
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
    }
  }
  /////////////////////////////////
  async getStudentByID(id: number): Promise<Student | null> {
    console.log('Id:', id);

    const selectQuery = 'SELECT * FROM STUDENT WHERE USER_ID_FK = ?';
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

      let user: Student | null = null;
      if (results.rows && results.rows[0] && results.rows[0][0]) {
        user = results.rows[0][0];
        console.log("User found in student table");
      } else {
        console.error("User not found in student table");
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
  /////////////////////////////////
  async getAllStudents(): Promise<Student[]> {
    try {
      const query = 'SELECT * FROM INSTRUCTOR';

      // Execute the query
      const result = await sql.query(connectionString, query);

      return result.recordset;
    } catch (error) {
      console.error("Error getting all users:", (error as any).message);
      throw error;
    } finally {
      await sql.close();
    }
  }
  /////////////////////////////////
  async updateStudent(filter: any, edit: any): Promise<void> {
    
  }
  /////////////////////////////////
  async deleteStudent(id: number): Promise<void> {
    try {
      const deleteQuery = 'DELETE FROM STUDENT WHERE USER_ID_FK = ?';
      const studentId = id;
      const result = await new Promise((resolve, reject) => {
        sql.queryRaw(connectionString, deleteQuery, [studentId], (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      console.log("the account is delete from the student")
    } catch (error) {
      console.error("Error deleting user:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
}
///////////////////////
export default StudentSQLServerDB;
