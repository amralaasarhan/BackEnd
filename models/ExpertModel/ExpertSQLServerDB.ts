import ExpertDAO from "./ExpertDAO";
import Expert from "./Expert";
const sql = require("msnodesqlv8");

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class ExpertSQLServerDB implements ExpertDAO {

  async addExpert(id: number,specialization:String): Promise<void> {
    const insertQuery = "INSERT INTO EXPERT (USER_ID_FK,SPECIALIZATION) VALUES (?,?)";
  
    const insertValues = [id,specialization];


    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
          if (err) {
            console.error('Error inserting record:', err);
            reject(err);
          } else {
            console.log('Query Results:', results);
            resolve(results);
          }
        });
      });

      if (results) {
        console.log('Record inserted successfully with ID:');
      } else {
        console.error('Failed to retrieve the inserted ID.');
        throw new Error('Failed to retrieve the inserted ID.');
      }
    } catch (error) {
      console.error('Error inserting record:', error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async getExpertByID(id: number): Promise<Expert | null> {
    console.log('Id:', id);

    const selectQuery = 'SELECT * FROM EXPERT WHERE USER_ID_FK = ?';
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

      let user: Expert | null = null;
     

      if (results && results.rows && results.rows.length > 0) {
        
        user = results.rows[0];
        console.log('User found:', user);
        
      } else {
        console.error("User not found ");
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

  async getAllExperts(): Promise<Expert[]> {
    try {
      const query = 'SELECT * FROM EXPERT';

      // Execute the query
      const result = await sql.query(connectionString, query);

      return result.recordset;
    } catch (error) {
      console.error("Error getting all users:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async updateExpert(filter: any, edit: any): Promise<void> {
    try {
      const updateQuery = `UPDATE EXPERT SET ... WHERE USER_ID_FK = ?`;
      const updateValues = Object.values(edit);

      await sql.query(connectionString, updateQuery, updateValues);
    } catch (error) {
      console.error("Error updating user:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async deleteExpert(id: number): Promise<void> {
    try {
      const deleteQuery = 'DELETE FROM EXPERT WHERE USER_ID_FK = ?';
      const supervisorId = id;
      const result = await new Promise((resolve, reject) => {
        sql.queryRaw(connectionString, deleteQuery, [supervisorId], (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      console.log("the account is delete from the Supervisor")
    } catch (error) {
      console.error("Error deleting user:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async getAllExpertsNames(): Promise<{ name: string; specialization: string }[]> {
    try {
        const selectQuery = `
            SELECT ENDUSER.USERNAME, EXPERT.SPECIALIZATION
            FROM ENDUSER 
            INNER JOIN EXPERT ON ENDUSER.ID = EXPERT.USER_ID_FK
        `;
        
        const result = await new Promise<{ name: string; specialization: string }[]>((resolve, reject) => {
            sql.queryRaw(connectionString, selectQuery, (err: any, result: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (!result || !result.rows || !Array.isArray(result.rows)) {
                    console.error("No rows found in the result:", result);
                    resolve([]); // Return an empty array if no rows are found
                    return;
                }
                
                // Map over the rows to extract expert names and specialization
                const expertsData = result.rows.map((row: any[]) => ({
                    name: row[0], // Use USERNAME instead of concatenating FNAME and LNAME
                    specialization: row[1]
                }));
                console.log("Expert Names and Specialization Model:", expertsData);
                resolve(expertsData);
            });
        });
        
        console.log("Retrieved all experts names and specialization:", result);
        return result;
    } catch (error) {
        console.error("Error retrieving experts names and specialization:", error);
        throw error;
    } finally {
        if (sql && sql.close) {
            await sql.close();
        }
    }
}

  

}

export default ExpertSQLServerDB;
