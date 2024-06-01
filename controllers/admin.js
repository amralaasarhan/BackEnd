const { default: Admin } = require("../models/AdminModel/Admin");
const { default: AdminSQLServerDB } = require("../models/AdminModel/AdminSQLServerDB");
const adminSQLServerDB = new AdminSQLServerDB();

exports.blockUser = async (req, res) => {
    const { username } = req.body;

  try {
    await adminSQLServerDB.blockUser(username);
    console.log("blocked");
    return res.status(200).json({ success: true, message: 'User blocked successfully.' });
  } catch (error) {
    console.error("Error blocking user:", error.message);
   return res.status(500).json({ success: false, error: 'Internal server error.' });
  }

}

exports.getAllUsernames = async (req, res) => {
    try {
        const usernames = await adminSQLServerDB.getAllUsernamesExceptAdmin();
       return res.status(200).json(usernames);
    } catch (error) {
        console.error("Error retrieving usernames:", error);
        return res.status(500).json({ error: 'Internal server error.' });
    }

}