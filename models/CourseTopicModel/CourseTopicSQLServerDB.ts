import CourseTopicDAO from "./CourseTopicDAO";
import CourseTopic from "./CourseTopic";
const sql = require("msnodesqlv8");
const bcrypt = require("bcrypt");

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
class CourseTopicSQLServerDB implements CourseTopicDAO {
  async addCourseTopic(topicName: string, courseId: number, courseIloId: number): Promise<any> {
    const insertQuery = "INSERT INTO COURSE_TOPIC (TOPIC_NAME,COURSE_ID_FK,COURSE_ILO_ID_FK) VALUES (?, ?,?)";
    const insertValues = [topicName, courseId, courseIloId];

    try {
      // Execute the insertion query
      await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, insertQuery, insertValues,
          (err: any, results: any) => {
            if (err) {
              console.error("Error inserting record:", err);
              reject(err);
            } else {
              console.log("Inserted Course Topic ID:", results.identity);
              resolve(results.identity);
            }
          }
        );
      });

      // Fetch the inserted course topic from the database to get its ID
      const selectQuery = "SELECT * FROM COURSE_TOPIC WHERE TOPIC_NAME = ?";
      const selectValues = [topicName];
      const courseTopic = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, selectValues, (err: any, results: any) => {
          if (err) {
            console.error("Error fetching inserted record:", err);
            reject(err);
          } else {
            resolve(results);
          }
        }
        );
      });

      return courseTopic; // Return the created course topic along with its ID
    } catch (error) {
      console.error("Error inserting record:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async getCourseTopicsDetails(courseId: number): Promise<CourseTopic[]> {
    console.log(" getCourseTopicsDetails  sql method is entered");
    try {
      const query = "SELECT * FROM COURSE_TOPIC WHERE COURSE_ID_FK = ?";
      const result = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, query, [courseId], (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      const courseTopicsArray: CourseTopic[] = [];
      if (result && result.rows && result.rows.length > 0) {
        for (const row of result.rows) {
          const courseTopic: CourseTopic = row;
          console.log('courseTopic found:', courseTopic);
          courseTopicsArray.push(courseTopic);
        }
        console.log('courseTopics found:', courseTopicsArray);
      } else {
        console.error("No courseTopics found for id:", courseId);
      }

      return courseTopicsArray;
    } catch (error) {
      console.error("Error retrieving courseTopics details:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async getCourseTopicByTopicName(topicName: String): Promise<CourseTopic | null> {
    console.log('CourseTopicName entered:', topicName);

    const selectQuery = 'SELECT * FROM COURSE_TOPIC WHERE TOPIC_NAME  = ?';
    const courseToCheck = topicName;

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

      let courseTopic: CourseTopic | null = null;
      if (results && results.rows && results.rows.length > 0) {
        results.rows.forEach((row: any) => {
          courseTopic = new CourseTopic(row[0], row[1], row[2], row[3]);
        });
        console.log('Course found:', courseTopic);
      } else {
        console.error("Course is not found:", topicName);
      }

      return courseTopic;
    } catch (error) {
      console.error("Error processing query results:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async updateCourseTopic(courseTopicId: number, updateData: any): Promise<void> {
    try {
      if (!Object.keys(updateData).length || !courseTopicId) {
        throw new Error("No data to update or course topic ID provided.");
      }
  
      const parsedUpdateData = JSON.parse(updateData);
  
      const updateColumnsArray = Object.entries(parsedUpdateData).map(([column, value]) => {
        return value ? `[${column}] = '${value}'` : null;
      });
  
      console.log('Update Columns Array:', updateColumnsArray);
  
      const updateColumns = updateColumnsArray.filter(column => column !== null).join(', ');
  
      const updateQuery = `UPDATE COURSE_TOPIC SET ${updateColumns} WHERE COURSE_TOPIC_ID = ${courseTopicId}`;
  
      console.log('Generated Query:', updateQuery);
  
      // Execute the query directly
      await new Promise((resolve, reject) => {
        sql.query(connectionString, updateQuery, (err: any, results: any) => {
          if (err) {
            console.error("Error updating COURSE_TOPIC:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.error("Error updating course topic:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
  

  async deleteCourseTopic(courseTopicId: number): Promise<void> {
    try {
      console.log("Hi method 1 entered")
      const deleteQuery = "DELETE FROM COURSE_TOPIC WHERE COURSE_TOPIC_ID = ?";
      const courseTopicToDelete = courseTopicId;
      const result = await new Promise((resolve, reject) => {
        sql.queryRaw(
          connectionString,
          deleteQuery,
          [courseTopicToDelete],
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
      console.error("Error deleting Course Topic:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
}

export default CourseTopicSQLServerDB;
