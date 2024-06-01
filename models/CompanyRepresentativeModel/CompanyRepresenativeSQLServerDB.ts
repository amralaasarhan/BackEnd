import CompanyRepresenativeDAO from "./CompanyRepresenativeDAO";
import CompanyRepresenative from "./CompanyRepresenative";
const sql = require("msnodesqlv8");

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class CompanyRepresenativeSQLServerDB implements CompanyRepresenativeDAO {

  async addCompanyRepresenative(id: number,companyName:String): Promise<void> {
    const insertQuery = "INSERT INTO COMPANY_REPRESENTATIVE (USER_ID_FK,COMPANY_NAME) VALUES (?,?)";
  
    const insertValues = [id,companyName];

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

  async getCompanyRepresenativeByID(id: number): Promise<CompanyRepresenative | null> {
    console.log('Id:', id);

    const selectQuery = 'SELECT * FROM COMPANY_REPRESENTATIVE WHERE USER_ID_FK = ?';
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

      let user: CompanyRepresenative | null = null;
     

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

  async getAllCompanyRepresenatives(): Promise<CompanyRepresenative[]> {
    try {
      const query = 'SELECT * FROM COMPANY_REPRESENTATIVE';

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

  async updateCompanyRepresenative(filter: any, edit: any): Promise<void> {
    try {
      const updateQuery = `UPDATE COMPANY_REPRESENTATIVE SET ... WHERE USER_ID_FK = ?`;
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

  async deleteCompanyRepresenative(id: number): Promise<void> {
    try {
      const deleteQuery = 'DELETE FROM COMPANY_REPRESENTATIVE WHERE USER_ID_FK = ?';
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

      console.log("the account is delete from the COMPANY_REPRESENTATIVE")
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

export default CompanyRepresenativeSQLServerDB;
