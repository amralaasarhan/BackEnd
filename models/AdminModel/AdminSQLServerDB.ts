import AdminDAO from "./AdminDAO";
import Admin from "./Admin";

const sql = require("msnodesqlv8");

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class AdminSQLServerDB implements AdminDAO{
    
    async blockUser(username: string): Promise<void> {
        try {
          const updateQuery = 'UPDATE ENDUSER SET USER_STATUS = ? WHERE USERNAME = ?';
          const userUsername = username;
          const userStatus = "BLOCKED"; // Change status to BLOCKED
          const result = await new Promise((resolve, reject) => {
            sql.queryRaw(connectionString, updateQuery, [userStatus, userUsername], (err: any, result: any) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });
        } catch (error) {
          console.error("Error updating user status:", (error as any).message);
          throw error;
        } finally {
          if (sql && sql.close) {
            await sql.close();
          }
        }
      }

      async getAdminByID(id: number): Promise<Admin | null> {
        console.log('Id:', id); 
    
        const selectQuery = 'SELECT * FROM ADMIN WHERE USER_ID_FK = ?';
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
    
            let user: Admin | null = null;
    
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

    async getAllUsernamesExceptAdmin(): Promise<string[]> {
      try {
          console.log('Retrieving usernames...'); 
          
          const selectQuery = `
              SELECT USERNAME 
              FROM ENDUSER 
              WHERE USER_STATUS = 'ACTIVATED'
              AND EMAIL != 'admin'
          `;
  
          const results = await new Promise<any>((resolve, reject) => {
              sql.queryRaw(connectionString, selectQuery, (err: any, results: any) => {
                  if (err) {
                      console.error("Error in database query:", err);
                      reject(err);
                  } else {
                      resolve(results);
                  }
              });
          });
  
          if (results && results.rows && results.rows.length > 0) {
              const usernames: string[] = results.rows.flat().filter((username: string) => !!username);
              console.log('Usernames retrieved:', usernames);
              return usernames;
          } else {
              console.error("No usernames found ");
              return [];
          }
      } catch (error) {
          console.error("Error processing query results:", error);
          throw error;
      } finally {
          if (sql && sql.close) {
              await sql.close();
          }
      }
  }
  
  
  
  

    
    
    
}

export default AdminSQLServerDB;