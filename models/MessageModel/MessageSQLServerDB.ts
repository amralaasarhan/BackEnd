import Message from "./Message";
import MessageDAO from "./MessageDAO";
const sql = require("msnodesqlv8");

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class MessageSQLServerDB implements MessageDAO {
  getMessage(filter: any): Promise<Message> {
    throw new Error("Method not implemented.");
  }
  async addMessage(message: Message): Promise<void> {
    const insertQuery = "INSERT INTO MESSAGE (RECEPIENT, SENDER, MESSAGE_TYPE, TIME, SUBJECT , BODY , USER_ID_FK) VALUES (?, ?, ?,?,?,?,?)";
    const insertValues = [message.recepient, message.sender, message.messageType, message.time, message.subject, message.body, message.userID];
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
 
  async getSentMessages(sender: string): Promise<Message[]> {
    const selectQuery = 'SELECT * FROM MESSAGE WHERE SENDER = ?';
    const messageToCheck = sender;

    try {
        const results = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(connectionString, selectQuery, [messageToCheck], (err: any, results: any) => {
                if (err) {
                    console.error("Error in database query:", err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const messages: Message[] = [];
        console.log(results.rows)
        if (results && results.rows && results.rows.length > 0) {
            results.rows.forEach((row: any) => {
                // Assuming the data structure returned by the database is { SENDER, RECIPIENT, SUBJECT, BODY, MESSAGE_TYPE, TIME, USER_ID_FK }
                const message = new Message(
                    row[2],  // sender
                    row[1],  // recipient
                    row[5],  // subject
                    row[6],  // body
                    row[3],  // message_type
                    new Date(row[4]),  // time
                    row[7],   // user_id_fk
                    row[8], // parentMsgID
                    row[0]
                );

                messages.push(message);
            });

            console.log('Messages found:', messages);
        } else {
            console.error("No messages found.");
        }

        return messages;
    } catch (error) {
        console.error("Error getting messages:", (error as any).message);
        throw error;
    } finally {
        if (sql && sql.close) {
            await sql.close();
        }
    }
}




  async getReceivedMessage(recepient: string): Promise<Message[]> {
    const selectQuery = 'SELECT * FROM MESSAGE WHERE RECEPIENT  = ?';
    const messageToCheck = recepient;
    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [messageToCheck], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      const messages: Message[] = [];

      if (results && results.rows && results.rows.length > 0) {
        results.rows.forEach((row: any) => {
          const message = new Message(
            row[2],  // sender
            row[1],  // recipient
            row[5],  // subject
            row[6],  // body
            row[3],  // message_type
            new Date(row[4]),  // time
            row[7],  // user_id_fk
            row[8], // parentMsgID
            row[0]

          );

          messages.push(message);
        });
        console.log('Messages found:', messages);
      } else {
      }

      return messages;
    } catch (error) {
      console.error("Error getting courses:", (error as any).message);
      throw error;
    }
    finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }






  
  deleteMessage(message: Message): void {
    throw new Error("Method not implemented.");
  }
  updateMessage(subject: string, edit: any): Promise<void> {
    throw new Error("Method not implemented.");
  }



}
export default MessageSQLServerDB;