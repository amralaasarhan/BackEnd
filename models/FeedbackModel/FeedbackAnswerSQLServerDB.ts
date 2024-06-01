import FeedbackAnswer from "./FeedbackAnswer";
import FeedbackAnswerDAO from "./FeedbackAnswerDAO";
const sql = require("msnodesqlv8");
const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
class FeedbackAnswerSQLServerDB implements FeedbackAnswerDAO {
    async addFeedbackAnswer(answer: FeedbackAnswer): Promise<void> {
        const insertQuery = "INSERT INTO FEEDBACK_ANSWERS (FEEDBACK_ID_FK, ANSWER, QUESTION_ID_FK) VALUES (?, ?, ?)";
        const insertValues = [answer.FEEDBACK_ID_FK, answer.ANSWER, answer.QUESTION_ID_FK];
        try {
          const results = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
              if (err) {
                console.error('Error inserting feedback answer  record:', err);
                reject(err);
              } else {
                console.log('Query Results:', results);
                resolve(results);
              }
            });
          });
        } catch (error) {
          console.error('Error inserting feedback answer record:', error);
          throw error;
        } finally {
          if (sql && sql.close) {
            await sql.close();
          }
        }
    } 
    
} export default FeedbackAnswerSQLServerDB
