import UserDAO from "./UserDAO";
import User from "./User";
const sql = require("msnodesqlv8");
const bcrypt = require('bcrypt');

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class UserSQLServerDB implements UserDAO {
  
  async  addUser(user: User): Promise<void> {
    const insertQuery = "INSERT INTO ENDUSER (EMAIL, PASS, FNAME, DOB, LNAME, MOBILE, USERNAME) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const insertValues = [user.email, user.pass, user.fName, user.DOB, user.lName, user.mobile, user.username];
    try {
        // Insert into ENDUSER table
        const endUserInsertResult = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
                if (err) {
                    console.error('Error inserting record into ENDUSER:', err);
                    reject(err);
                } else {
                    console.log('Record inserted into ENDUSER:', results);
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

  ///////////////////////////////////////////////////////////////

  async login(email: string, pass: String): Promise<{ user: User | null, userId: number | null }> {
    console.log('Email entered:', email);
    console.log("Pass", pass)

    const selectQuery = 'SELECT * FROM ENDUSER WHERE EMAIL = ?';
    const emailToCheck = email;


    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [emailToCheck], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {

            console.log('Query Results:', results);
            resolve(results);
          }
        });
      });

      let user: User | null = null;
      let userId: number | null = null;

      if (results && results.rows && results.rows.length > 0) {

        user = results.rows[0];
        console.log('User found:', user);
        userId = results.rows[0][0];
        console.log('ID:', userId);
      } else {
        console.error("User not found for email:", email);
      }

      return { user, userId };
    } catch (error) {
      console.error("Error processing query results:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  ///////////////////////////////////////////////////////////////

  async getUserByEmail(email: string): Promise<User | null> {
    console.log('Email entered:', email);

    const selectQuery = 'SELECT * FROM  ENDUSER WHERE EMAIL = ?';
    const emailToCheck = email;

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [emailToCheck], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      let user: User | null = null;
      if (results && results.rows && results.rows.length > 0) {
        user = results.rows[0];
        console.log('User found:', user);

      } else {
        console.error("User not found for email:", email);
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

  ///////////////////////////////////////////////////////////////

  async getUserByUsername(username: string): Promise<User | null> {
    console.log('Username entered:', username);

    const selectQuery = 'SELECT * FROM ENDUSER WHERE USERNAME = ?';
    const usernameToCheck = username;

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [usernameToCheck], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      let user: User | null = null;
      if (results && results.rows && results.rows.length > 0) {
        user = results.rows[0]; // Assuming the first row contains the user data
        console.log('User found:', user);
      } else {
        console.error("User not found for username:", username);
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

  ///////////////////////////////////////////////////////////////

  async getAllUsers(): Promise<User[]> {
    try {
      // Construct a query to retrieve all users
      const query = 'SELECT * FROM ENDUSER';

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

  ///////////////////////////////////////////////////////////////
  async updateUser(filter: any, updateData: any): Promise<void> {
    try {

      if (!Object.keys(updateData).length || !Object.keys(filter).length) {
        throw new Error("No columns to update or filter provided.");
      }

      const updateColumnsArray = Object.entries(updateData).map(([column, value]) => {
        return value ? `${column} = @${column}` : null;
      });

      const updateColumns = updateColumnsArray.filter(column => column !== null).join(', ');


      const whereClause = Object.keys(filter).map(column => `${column} = @${column}`).join(' AND ');

      const updateQuery = `UPDATE ENDUSER SET ${updateColumns} WHERE ${whereClause}`
        .replace(/@USERNAME/g, `'${updateData.USERNAME}'`)
        .replace(/@LNAME/g, `'${updateData.LNAME}'`)
        .replace(/@FNAME/g, `'${updateData.FNAME}'`)
        .replace(/@MOBILE/g, `'${updateData.MOBILE}'`)
        .replace(/@DOB/g, `'${updateData.DOB}'`)
        .replace(/@PASS/g, `'${updateData.PASS}'`)
        .replace(/@EMAIL/g, `'${filter.EMAIL}'`);

      console.log('Generated Query:', updateQuery);

      // Execute the query directly
      await new Promise((resolve, reject) => {
        sql.query(connectionString, updateQuery, (err: any, results: any) => {
          if (err) {
            console.error("Error updating user:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    } finally {
      // Close the SQL connection (if applicable)
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
  ///////////////////////////////////////////////////////////////

  async deleteUser(email: string): Promise<void> {
    try {
      const updateQuery = 'UPDATE ENDUSER SET USER_STATUS = ? WHERE EMAIL = ?';
      const userEmail = email;
      const userStatus = "DELETED"
      const result = await new Promise((resolve, reject) => {
        sql.queryRaw(connectionString, updateQuery, [userStatus, userEmail], (err: any, result: any) => {
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
}

export default UserSQLServerDB;
