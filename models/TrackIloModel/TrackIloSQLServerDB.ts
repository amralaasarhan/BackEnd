import TrackIlo from "./TrackIlo";
import TrackIloDAO from "./TrackIloDAO";
const sql = require("msnodesqlv8");
const bcrypt = require("bcrypt");

const connectionString ="server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class TrackIloSQLServerDB implements TrackIloDAO {
  async addTrackIlo(trackOutcome: string, trackType: string, trackId: number, trackDescription: string): Promise<void> {

    const insertQuery =
      "INSERT INTO TRACK_ILO (TRACK_OUTCOME, TRACK_TYPE, TRACK_FK,TRACK_ILO_DESCRIPTION) VALUES (?, ?, ?,?)";
    const insertValues = [trackOutcome, trackType, trackId, trackDescription];

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
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
  async deleteTrackIlo(trackIloId: number): Promise<void> {
    try {
      const deleteQuery = "DELETE FROM TRACK_ILO WHERE TRACK_ILO_ID = ?";
      const trackIloToDelete = trackIloId;
      const result = await new Promise((resolve, reject) => {
        sql.queryRaw(
          connectionString,
          deleteQuery,
          [trackIloToDelete],
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error deleting Track ILO:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async getTrackILOById(id: number): Promise<TrackIlo | null> {
    console.log('Track Ilo Id  entered:', id);

    const selectQuery = 'SELECT * FROM TRACK_ILO WHERE TRACK_ILO_ID = ?';
    const courseToCheck = id;

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [courseToCheck], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      let trackILO: TrackIlo | null = null;
      if (results && results.rows && results.rows.length > 0) {
        results.rows.forEach((row: any) => {
          trackILO = new TrackIlo(row[0], row[1], row[2], row[3],row[4]);
        });
        console.log('Track ILo  found:', trackILO);

      } else {
        console.error("Track Ilo  is not found:", id);
      }

      return trackILO;
    } catch (error) {
      console.error("Error processing query results:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }


  ///////////////////////
  async  updateTrackIlo(trackIloId: number, updateData: any): Promise<void> {
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
          .replace(/@TRACK_ILO_DESCRIPTION/g, `'${updateData.TRACK_ILO_DESCRIPTION}'`)
  
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
       

  async getTrackIloDetails(trackId: number): Promise<TrackIlo[]> {
    console.log("the sql method is entered");
    try {
      const query = "SELECT * FROM TRACK_ILO WHERE TRACK_FK = ?";
      const result = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, query, [trackId], (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
  
      const trackIlos: TrackIlo[] = [];
      if (result && result.rows && result.rows.length > 0) {
        for (const row of result.rows) {
          const trackIlo: TrackIlo = row;
          console.log('Track found:', trackIlo);
          trackIlos.push(trackIlo);
        }
      } else {
        console.error("No tracks found for id:", trackId);
      }
  
      return trackIlos;
    } catch (error) {
      console.error("Error retrieving Track ILO details:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
  

}


export default TrackIloSQLServerDB
