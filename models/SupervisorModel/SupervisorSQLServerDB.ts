import SupervisorDAO from "./SupervisorDAO";
import Supervisor from "./Supervisor";
const sql = require("msnodesqlv8");

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class SupervisorSQLServerDB implements SupervisorDAO {

  async addSupervisor(id: number): Promise<void> {
    const insertQuery = "INSERT INTO PATH_SUPERVISOR (USER_ID_FK) VALUES (?)";
    const insertValues = [id];

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

  async getSupervisorByID(id: number): Promise<Supervisor | null> {
    console.log('Id:', id);

    const selectQuery = 'SELECT * FROM PATH_SUPERVISOR WHERE USER_ID_FK = ?';
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

      let user: Supervisor | null = null;


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
  async getSupervisorName(trackTitle: string): Promise<{ trackTitle: string; username: string } | null> {
    try {
      const selectQuery =
        `SELECT TRACK.TRACK_TITLE, ENDUSER.USERNAME
            FROM ENDUSER 
            INNER JOIN PATH_SUPERVISOR ON ENDUSER.ID = PATH_SUPERVISOR.USER_ID_FK
            INNER JOIN TRACK ON PATH_SUPERVISOR.PATH_SUPERVISOR_ID = TRACK.PATH_SUPERVISOR_ID_FK
            WHERE TRACK.TRACK_TITLE = ?`
        ;

      const result = await new Promise<{ trackTitle: string; username: string }>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [trackTitle], (err: any, result: any) => {
          if (err) {
            reject(err);
            return null;
          }

          if (!result || !result.rows || result.rows.length === 0) {
            console.error("No supervisor found for track title:", trackTitle);
            return null;
          }

          const supervisor = {
            trackTitle: result.rows[0][0], // First column contains track title
            username: result.rows[0][1]     // Second column contains username
          };

          console.log("Supervisor:", supervisor);
          resolve(supervisor);
        });
      });

      console.log("Retrieved supervisor for track title:", trackTitle, result);
      return result;
    } catch (error) {
      console.error("Error retrieving supervisor for track title:", trackTitle, error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }



  async getAllSupervisors(): Promise<Supervisor[]> {
    try {
      const query = 'SELECT * FROM PATH_SUPERVISOR';

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

  async updateSupervisor(filter: any, edit: any): Promise<void> {
    try {
      const updateQuery = `UPDATE PATH_SUPERVISOR SET ... WHERE USER_ID_FK = ?`;
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

  async deleteSupervisor(id: number): Promise<void> {
    try {
      const deleteQuery = 'DELETE FROM PATH_SUPERVISOR WHERE USER_ID_FK = ?';
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


  async getSupervisorNamebyID(supervisorID: number): Promise<{ trackTitle: string; username: string } | null> {
    try {
      const selectQuery =
        `SELECT ENDUSER.USERNAME FROM ENDUSER INNER JOIN PATH_SUPERVISOR ON ENDUSER.ID=PATH_SUPERVISOR.USER_ID_FK WHERE PATH_SUPERVISOR.PATH_SUPERVISOR_ID=?`
        ;

      const result = await new Promise<{ trackTitle: string; username: string }>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [supervisorID], (err: any, result: any) => {
          if (err) {
            reject(err);
            return null;
          }

          if (!result || !result.rows || result.rows.length === 0) {
            console.error("No supervisor found for id:", supervisorID);
            return null;
          }

          const userName = result.rows[0][0]

          console.log("Supervisor username :", userName);
          resolve(userName);
        });
      });

      console.log("Retrieved supervisor for track title:", supervisorID, result);
      return result;
    } catch (error) {
      console.error("Error retrieving supervisor for track title:", supervisorID, error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }


}

export default SupervisorSQLServerDB;
