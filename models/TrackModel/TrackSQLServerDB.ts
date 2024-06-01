import { log } from "console";
import Track from "./Track";
import TrackDAO from "./TrackDAO"
const sql = require("msnodesqlv8");
const bcrypt = require('bcrypt');

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class TrackSQLServerDB implements TrackDAO {

  async addTrack(trackTitle: string, trackDescription: string, id: number): Promise<void> {
    const insertQuery = "INSERT INTO TRACK (TRACK_TITLE, TRACK_DESCRIPTION, PATH_SUPERVISOR_ID_FK) VALUES (?, ?, ?)";
    const insertValues = [trackTitle, trackDescription, id];

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
  async getTrackByTitle(title: string): Promise<Track | null> {
    console.log('Title entered:', title);

    const selectQuery = 'SELECT * FROM TRACK WHERE TRACK_TITLE = ?';
    const titleToCheck = title;

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [titleToCheck], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      let track: Track | null = null;
      if (results && results.rows && results.rows.length > 0) {
        // Provide the trackImage argument
        track = new Track(results.rows[0][0], results.rows[0][1], results.rows[0][2], results.rows[0][3]);
        console.log('Track found:', track);
      } else {
        console.error("Track not found for title:", title);
      }

      return track;
    } catch (error) {
      console.error("Error processing query results:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }


  async getTracksByTitle(title: string): Promise<Track[]> {
    console.log('Query entered:', title);

    const selectQuery = 'SELECT * FROM TRACK WHERE TRACK_TITLE LIKE ?';
    const queryToCheck = `%${title}%`;

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [queryToCheck], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      const tracks: Track[] = [];
      if (results && results.rows && results.rows.length > 0) {
        results.rows.forEach((row: any) => {
          // Provide the trackImage argument
          const track: Track = new Track(row[0], row[1], row[2], row[3]);
          tracks.push(track);
        });
        console.log('Tracks found:', tracks);
      } else {
        console.error("No tracks found for the query:", title);
      }

      return tracks;
    } catch (error) {
      console.error("Error processing query results:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }



  //////////////////////////////////////////////////////////////
  async getTrackById(id: number): Promise<Track | null> {
    console.log('ID entered:', id);

    const selectQuery = 'SELECT * FROM TRACK WHERE TRACK_ID = ?';
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

      let track: Track | null = null;
      if (results && results.rows && results.rows.length > 0) {
        // Provide the trackImage argument
        track = new Track(results.rows[0][0], results.rows[0][1], results.rows[0][2], results.rows[0][3]);
        console.log('Track found:', track);
      } else {
        console.error("Track not found for id:", id);
      }

      return track;
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
  async getAllTracksByPathSupervisorId(pathSupervisorId: number): Promise<Track[]> {
    try {
      const selectQuery = 'SELECT * FROM TRACK WHERE PATH_SUPERVISOR_ID_FK =?';

      try {
        const results = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, selectQuery, [pathSupervisorId], (err: any, results: any) => {
            if (err) {
              console.error("Error in database query:", err);
              reject(err);
            } else {
              resolve(results);
            }
          });
        });

        const tracks: Track[] = [];
        if (results && results.rows && results.rows.length > 0) {
          results.rows.forEach((row: any) => {
            const track: Track = new Track(row[0], row[1], row[2], row[3]);
            tracks.push(track);
          });
        } else {
          console.error("No tracks found for this supervisor.");
        }

        return tracks;
      } catch (error) {
        console.error("Error getting Tracks by PATH_SUPERVISOR_ID_FK:", (error as any).message);
        throw error;
      }
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }


  async getRegisterdTracks(studentId: number): Promise<Track[] | null> {
    try {
      const selectQuery = `
      SELECT TRACK.TRACK_ID, TRACK.TRACK_TITLE, TRACK.TRACK_DESCRIPTION
      FROM STUDENT_TRACK
      JOIN TRACK ON STUDENT_TRACK.TRACK_ID_FK = TRACK.TRACK_ID
      WHERE STUDENT_TRACK.STUDENT_ID_FK = (
          SELECT STUDENT_ID
          FROM STUDENT
          WHERE USER_ID_FK = ?
      )`;

      /*const selectQuery = `SELECT TRACK.TRACK_ID, TRACK.TRACK_TITLE, TRACK.TRACK_DESCRIPTION
      FROM STUDENT_TRACK
      JOIN TRACK ON STUDENT_TRACK.TRACK_ID_FK = TRACK.TRACK_ID
      WHERE STUDENT_TRACK.STUDENT_ID_FK = ?`;*/

      try {
        const results = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, selectQuery, [studentId], (err: any, results: any) => {
            if (err) {
              console.error("Error in database query:", err);
              reject(err);
            } else {
              resolve(results);
            }
          });
        });

        const tracks: Track[] = [];
        if (results && results.rows && results.rows.length > 0) {
          results.rows.forEach((row: any) => {
            const track: Track = new Track(row[0], row[1], row[2], row[3]);
            tracks.push(track);
          });
          console.log('Tracks found:', tracks);
        } else {
          console.error("No tracks found .");
        }

        return tracks;
      } catch (error) {
        console.error("Error getting Tracks:", (error as any).message);
        throw error;
      }
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
  ////////////////////////////////////////////////////////////
  async getAllTracks(): Promise<Track[]> {
    try {
      const selectQuery = 'SELECT * FROM TRACK ';

      try {
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

        const tracks: Track[] = [];
        if (results && results.rows && results.rows.length > 0) {
          results.rows.forEach((row: any) => {
            const track: Track = new Track(row[0], row[1], row[2], row[3]);
            tracks.push(track);
          });
          console.log('Tracks found:', tracks);
        } else {
          console.error("No tracks found .");
        }

        return tracks;
      } catch (error) {
        console.error("Error getting Tracks:", (error as any).message);
        throw error;
      }
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
  ///////////////////////////////////////////////////////////////

  async updateTrack(trackTitle: string, updateData: any): Promise<void> {
    try {
      if (!Object.keys(updateData).length || !trackTitle) {
        throw new Error("No data to update or track title provided.");
      }

      const updateColumnsArray = Object.entries(updateData).map(([column, value]) => {
        return value ? `${column} = '${value}'` : null;
      });

      const updateColumns = updateColumnsArray.filter(column => column !== null).join(', ');

      const updateQuery = `UPDATE dbo.TRACK SET ${updateColumns} WHERE TRACK_TITLE = '${trackTitle}'`;

      console.log('Generated Query:', updateQuery);

      // Execute the query directly
      await new Promise((resolve, reject) => {
        sql.query(connectionString, updateQuery, (err: any, results: any) => {
          if (err) {
            console.error("Error updating TRACK:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.error("Error updating track:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }



  ///////////////////////////////////////////////////////////////

  async deleteTrack(title: string): Promise<void> {
    try {
      const deleteQuery = 'DELETE FROM TRACK WHERE TRACK_TITLE = ?';
      const trackTitle = title;
      const result = await new Promise((resolve, reject) => {
        sql.queryRaw(connectionString, deleteQuery, [trackTitle], (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error("Error deleting TRACK:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async getTrackByNameQuery(query: string): Promise<Track[]> {
    console.log('Query entered:', query);

    const selectQuery = 'SELECT * FROM TRACK WHERE TRACK_TITLE LIKE ?';
    const queryToCheck = `${query}%`;
    console.log(queryToCheck)

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [queryToCheck], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      const tracks: Track[] = [];
      if (results && results.rows && results.rows.length > 0) {
        results.rows.forEach((row: any) => {
          // Provide the trackImage argument
          const track: Track = new Track(row[0], row[1], row[2], row[3]);
          tracks.push(track);
        });
        console.log('Tracks found:', tracks);
      } else {
        console.error("No tracks found for the query:", query);
      }

      return tracks;
    } catch (error) {
      console.error("Error processing query results:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
  async addStudentToTrack(stdId : number ,  trackId : number): Promise<void> {
    const insertQuery = "INSERT INTO STUDENT_TRACK (STUDENT_ID_FK, TRACK_ID_FK) VALUES (?, ?)";
    const insertValues = [stdId, trackId];
    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
          if (err) {
            console.error('Error inserting registering student to track :', err);
            reject(err);
          } else {
            console.log('Query Results:', results);
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.error('Error inserting registering student to track:', error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
}


export default TrackSQLServerDB;