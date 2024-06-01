const { default: Instructor } = require("../models/InstructorModel/insturctor")
const { default: InstructorSQLServerDB } = require("../models/InstructorModel/InstructorSQLServerDB.js");
const { default: InstructorMongoDB } = require("../models/InstructorModel/InstructorMongoDB.js")
const instructorSQLServerDB = new InstructorSQLServerDB();

const { default: Track } = require("../models/TrackModel/Track")
const { default: TrackSQLServerDB } = require("../models/TrackModel/TrackSQLServerDB.js");
// const { default: InstructorMongoDB } = require("../models/InstructorModel/InstructorMongoDB.js")
const trackSQLServerDB = new TrackSQLServerDB();
exports.addInstructor = async (req, res) => {
    id = req.body.id;
    const results = await instructorSQLServerDB.addInstructor(id);
    return res.json(results);
};

exports.getInstructors = async (req, res) => {
    const results = await instructorSQLServerDB.getAllInstructors();
    return res.json(results);
};
// instructorControllers.getTrackByName
exports.getTrackByName= async (req, res)=> {
    try {
        const query = req.query.query; // Assuming the query parameter is named 'query'
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is missing' });
        }

        const tracks = await trackSQLServerDB.getTracksByTitleQuery(query);

        // Handle the response as needed
        return res.json(tracks);
    } catch (error) {
        console.error('Error in getTrackByName controller:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

