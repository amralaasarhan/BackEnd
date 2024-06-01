
const natural = require("natural"); 
const stopword = require("stopword"); 
const { default: User } = require("../models/UserModel/User");
const { default: UserSQLServerDB } = require("../models/UserModel/UserSQLServerDB");
const userSQLServerDB = new UserSQLServerDB();

//Supervisor Model
const { default: Supervisor } = require("../models/SupervisorModel/Supervisor")
const { default: SupervisorSQLServerDB } = require("../models/SupervisorModel/SupervisorSQLServerDB");
const supervisorSQLServerDB = new SupervisorSQLServerDB();
const { default: SupervisorMongoDB } = require("../models/SupervisorModel/SupervisorMongoDB");
const supervisorMongoDB = new SupervisorMongoDB();

//MessageModel
const { default: Message } = require("../models/MessageModel/Message")
const { default: MessageMongoDB } = require("../models/MessageModel/MessageMongoDB")
const { default: MessageSQLServerDB } = require("../models/MessageModel/MessageSQLServerDB");
const messageSQLServerDB = new MessageSQLServerDB();
const messageMongoDB = new MessageMongoDB();

//Track model
const { default: Track } = require("../models/TrackModel/Track");
const { default: TrackImage } = require("../models/TrackModel/TrackImage");
const { default: TrackSQLServerDB } = require("../models/TrackModel/TrackSQLServerDB");
const trackSQLServerDB = new TrackSQLServerDB();
const trackImageModel = new TrackImage();

//Track Ilo Model
const { default: TrackIlo } = require("../models/TrackIloModel/TrackIlo");
const { default: TrackIloSQLServerDB, } = require("../models/TrackIloModel/TrackIloSQLServerDB");
const trackIloSQLServerDB = new TrackIloSQLServerDB();

//Course Model
const { default: Course } = require("../models/CourseModel/Course");
const { default: CourseImage } = require("../models/CourseModel/CourseImage");
const { default: CourseSQLServerDB } = require("../models/CourseModel/CourseSQLServerDB");
const courseSQLServerDB = new CourseSQLServerDB();
const CourseImageModel = new CourseImage();

//Course Ilo Model
const { default: CourseIlo } = require("../models/CourseIloModel/CourseIlo");
const { default: CourseIloSQLServerDB } = require("../models/CourseIloModel/CourseIloSQLServerDB");
const courseIloSQLServerDB = new CourseIloSQLServerDB();

//Course Topic Model
const { default: CourseTopic } = require("../models/CourseTopicModel/CourseTopic");
const { default: CourseTopicMongoDB } = require("../models/CourseTopicModel/CourseTopicMongoDB");
const { default: CourseTopicSQLServerDB } = require("../models/CourseTopicModel/CourseTopicSQLServerDB");
const courseTopicSQLServerDB = new CourseTopicSQLServerDB();
const courseTopicMongoDB = new CourseTopicMongoDB();

//Survey Model

const { default: Survey } = require("../models/SurveyModel/Survey");
const { default: SurveyQuestion } = require("../models/SurveyModel/SurveyQuestion");
const { default: SurveySQLServerDB } = require("../models/SurveyModel/SurveySQLServerDB");
const { default: SurveyQuestionSQLServerDB } = require("../models/SurveyModel/SurveyQuestionSQLServerDB");
const surveyQuestionSQLServerDB = new SurveyQuestionSQLServerDB();
const surveySQLServerDB = new SurveySQLServerDB();

//Feedback Model
const { default: Feedback } = require("../models/FeedbackModel/Feedback");
const { default: FeedbackSQLServerDB } = require("../models/FeedbackModel/FeedbackSQLServerDB");
const { default: FeedbackAnswerSQLServerDB } = require("../models/FeedbackModel/FeedbackAnswerSQLServerDB");
const { default: FeedbackAnswer } = require("../models/FeedbackModel/FeedbackAnswer");
const feedbackSQLServerDB = new FeedbackSQLServerDB();
const feedbackAnswerSQLServerDB = new FeedbackAnswerSQLServerDB();

// SubmissionModel
const { default: Submission } = require("../models/SubmissionModel/Submission");
const { default: SubmissionMongoDB } = require("../models/SubmissionModel/SubmissionMongoDB");
const { default: SubmissionSQLServerDB } = require("../models/SubmissionModel/SubmissionSQLServerDB");
const submissionSQLServerDB = new SubmissionSQLServerDB();
const submissionMongoDB = new SubmissionMongoDB();

//Assesment Model
const { default: Assesment } = require("../models/AssesmentModel/Assesment");
const { default: AssesmentMongoDB } = require("../models/AssesmentModel/AssesmentMongoDB");
const { default: AssesmentSQLServerDB } = require("../models/AssesmentModel/AssesmentSQLServerDB");
const assesmentSQLServerDB = new AssesmentSQLServerDB();
const assessmentMongoDB = new AssesmentMongoDB();
const { default: demoAssessmentSQLServerDB } = require("../models/AssesmentModel/demoAssessmentSQLServerDB");
const demoAss = new demoAssessmentSQLServerDB();
const { default: assessmentMongo } = require("../models/AssesmentModel/demoMongo");
const demoMongo = new assessmentMongo();


const jwt = require("jsonwebtoken")
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { status } = require("init");

//////////////------------Add track  + Track Image------------////////////////////
exports.addTrack = async (request, response) => {
    userType = request.user.userType;
    try {
        const titleFilter = await trackSQLServerDB.getTrackByTitle(request.body.title);
        if (titleFilter) {
            return response.status(400).json({
                status: "Error",
                message: "This track already exists"
            });
        }

        const supervisorEmail = request.user.email;
        const emailCheck = await userSQLServerDB.getUserByEmail(supervisorEmail);
        const id = request.user.id;

        if (id === null) {
            return response.status(404).json({
                status: "Error",
                message: "User not found"
            });
        }

        const supervisorCheck = await supervisorSQLServerDB.getSupervisorByID(id);
        const supervisorId = supervisorCheck[0];

        if (!emailCheck && !supervisorId) {
            return response.status(404).json({
                status: "Error",
                message: "User not found"
            });
        }

        await trackSQLServerDB.addTrack(request.body.title, request.body.description, supervisorId);

        // Get the track ID after adding the track
        const trackIdQuery = await trackSQLServerDB.getTrackByTitle(request.body.title);
        const trackId = trackIdQuery.trackId;
        console.log(trackId)
        // Insert the image associated with the track
        const imgData = request.file.buffer;
        const queryResult = await trackImageModel.insertTrackImage(imgData, trackId);

        const supervisor = new Supervisor(emailCheck[5], emailCheck[7], emailCheck[1], emailCheck[3], emailCheck[4], emailCheck[2], request.user.userType, emailCheck[6]);

        return response.status(200).json({
            status: "OK",
            message: `${userType} track added successfully`
        });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};


//////////////------------update Track  + Track Image------------////////////////////
exports.updateTrack = async (req, res) => {
    try {
        const { trackTitle } = req.params;
        let updateData
        const decodedTrackTitle = decodeURIComponent(trackTitle);
        console.log("track ", trackTitle)
        console.log("track decoded", decodedTrackTitle)
        if (req.body && req.body.updateData) {
            updateData = JSON.parse(req.body.updateData);
            // Use updateData here...
        } else {
            console.error('Missing updateData in request body');
            // Handle the error appropriately (e.g., return a 400 Bad Request)
        }

        const trackIdQuery = await trackSQLServerDB.getTrackByTitle(decodedTrackTitle);
        const trackId = trackIdQuery.trackId;
        console.log("Track Id ====", trackId);

        let imageId;
        if (req.file) { // Check if file is included in the request
            const imageFile = req.file.buffer;
            imageId = await trackImageModel.updateTrackImageByID(trackId, imageFile);


        }

        console.log("Updated Data :> ", updateData)
        console.log("updated Title", updateData.TRACK_TITLE, "***")

        console.log("updated desc", updateData.TRACK_DESCRIPTION, "***")
        if ((updateData.TRACK_TITLE.length > 0) || (updateData.TRACK_DESCRIPTION.length > 0)) {
            console.log("If condtion entered")
            await trackSQLServerDB.updateTrack(decodedTrackTitle, updateData);
        }
        return res.status(200).json({
            status: "OK",
            message: 'Track updated successfully.'
        });
    } catch (error) {
        console.error('Error updating track:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

//////////////------------delete Track + track Image------------////////////////////
exports.deleteTrack = async (req, res) => {
    try {
        const { trackTitle } = req.params.trackTitle;
        const decodedTrackTitle = decodeURIComponent(req.params.trackTitle);
        console.log("track ", trackTitle)
        console.log("track decoded", decodedTrackTitle)// Parse the update data from JSON string

        const trackIdQuery = await trackSQLServerDB.getTrackByTitle(decodedTrackTitle);
        const trackId = trackIdQuery.trackId;


        await trackImageModel.deleteTrackImageByID(parseInt(trackId, 10));
        await trackSQLServerDB.deleteTrack(decodedTrackTitle);

        return res.status(200).json({ status: 'ok', message: 'Track deleted successfully' });
    } catch (error) {
        console.error("Error in deleteTrackController:", error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

//////////////------------View Tracks of this supervisor  + Track Image--------////////////////////
exports.viewTracks = async (request, response) => {
    try {
        // const supervisorEmail = request.user.email;

        // const emailCheck = await userSQLServerDB.getUserByEmail(supervisorEmail);
        // const id = emailCheck[0];
        // const supervisorCheck = await supervisorSQLServerDB.getSupervisorByID(1);


   
            const tracks = await trackSQLServerDB.getTrackById(16);
            for (let i = 0; i < tracks.length; i++) {
                const trackId = 16

                // Retrieve track image by trackId
                const trackImageQuery = await trackImageModel.getTrackImageByID(trackId);
                if (trackImageQuery !== null && trackImageQuery.image) {
                    // Convert track image buffer to base64 string
                    const base64TrackImage = Buffer.from(trackImageQuery.image.buffer).toString('base64');
                    tracks[i].trackImage = base64TrackImage;
                } else {
                    // If track image not found, set track image to null
                    tracks[i].trackImage = null;
                }

                // Retrieve all courses associated with the track
                const trackCourses = await courseSQLServerDB.getAllCoursesForTrack(trackId);
                let courses = [];
                // Loop through each course to fetch its details and image
                for (let j = 0; j < trackCourses.length; j++) {
                    const courseId = trackCourses[j];
                    // Retrieve course details by courseId
                    const course = await courseSQLServerDB.getCourseById(courseId);
                    // Retrieve course image by courseId
                    const courseImageQuery = await CourseImageModel.getCourseImageByID(courseId);
                    if (courseImageQuery !== null && courseImageQuery.image) {
                        // Convert course image buffer to base64 string
                        const base64CourseImage = Buffer.from(courseImageQuery.image.buffer).toString('base64');
                        course.courseImage = base64CourseImage;
                    } else {
                        // If course image not found, set course image to null
                        course.courseImage = null;
                    }
                    courses.push(course);
                }
                tracks[i].courses = courses;
            
            }
            return response.status(200).json({ tracks });
        
        // // console.log("----------", supervisorCheck)
        // // const supervisorID = supervisorCheck[0];


        // if (supervisorCheck == null) {
        //     const tracks = await trackSQLServerDB.getRegisterdTracks(id);
        //     for (let i = 0; i < tracks.length; i++) {
        //         const trackId = tracks[i].trackId;

        //         // Retrieve track image by trackId
        //         const trackImageQuery = await trackImageModel.getTrackImageByID(trackId);
        //         if (trackImageQuery !== null && trackImageQuery.image) {
        //             // Convert track image buffer to base64 string
        //             const base64TrackImage = Buffer.from(trackImageQuery.image.buffer).toString('base64');
        //             tracks[i].trackImage = base64TrackImage;
        //         } else {
        //             // If track image not found, set track image to null
        //             tracks[i].trackImage = null;
        //         }

        //         // Retrieve all courses associated with the track
        //         const trackCourses = await courseSQLServerDB.getAllCoursesForTrack(trackId);
        //         let courses = [];
        //         // Loop through each course to fetch its details and image
        //         for (let j = 0; j < trackCourses.length; j++) {
        //             const courseId = trackCourses[j];
        //             // Retrieve course details by courseId
        //             const course = await courseSQLServerDB.getCourseById(courseId);
        //             // Retrieve course image by courseId
        //             const courseImageQuery = await CourseImageModel.getCourseImageByID(courseId);
        //             if (courseImageQuery !== null && courseImageQuery.image) {
        //                 // Convert course image buffer to base64 string
        //                 const base64CourseImage = Buffer.from(courseImageQuery.image.buffer).toString('base64');
        //                 course.courseImage = base64CourseImage;
        //             } else {
        //                 // If course image not found, set course image to null
        //                 course.courseImage = null;
        //             }
        //             courses.push(course);
        //         }
        //         tracks[i].courses = courses;
        //     }

        //     return response.status(200).json({ tracks });
        // }
        // if (!emailCheck && !supervisorID) {
        //     return response.status(404).json({
        //         status: "Error",
        //         message: "User not found"
        //     });
        // }



        // const tracks = await trackSQLServerDB.getAllTracksByPathSupervisorId(supervisorID);

        // for (let i = 0; i < tracks.length; i++) {
        //     const trackId = tracks[i].trackId;

        //     // Retrieve track image by trackId
        //     const trackImageQuery = await trackImageModel.getTrackImageByID(trackId);
        //     if (trackImageQuery !== null && trackImageQuery.image) {
        //         // Convert track image buffer to base64 string
        //         const base64TrackImage = Buffer.from(trackImageQuery.image.buffer).toString('base64');
        //         tracks[i].trackImage = base64TrackImage;
        //     } else {
        //         // If track image not found, set track image to null
        //         tracks[i].trackImage = null;
        //     }

        //     // Retrieve all courses associated with the track
        //     const trackCourses = await courseSQLServerDB.getAllCoursesForTrack(trackId);
        //     let courses = [];
        //     // Loop through each course to fetch its details and image
        //     for (let j = 0; j < trackCourses.length; j++) {
        //         const courseId = trackCourses[j];
        //         // Retrieve course details by courseId
        //         const course = await courseSQLServerDB.getCourseById(courseId);
        //         // Retrieve course image by courseId
        //         const courseImageQuery = await CourseImageModel.getCourseImageByID(courseId);
        //         if (courseImageQuery !== null && courseImageQuery.image) {
        //             // Convert course image buffer to base64 string
        //             const base64CourseImage = Buffer.from(courseImageQuery.image.buffer).toString('base64');
        //             course.courseImage = base64CourseImage;
        //         } else {
        //             // If course image not found, set course image to null
        //             course.courseImage = null;
        //         }
        //         courses.push(course);
        //     }
        //     tracks[i].courses = courses;
        // }

    
    } catch (error) {
        console.error(error);
        response.status(500).json({ status: 'Error', message: 'Internal Server Error' });
    }
};

////////////////////////////////////////---Track Images--//////////////////////////////////////////
///////////////////////////////////////--Add track image--////////////////////////////////////////
exports.addTrackImage = async (request, response) => {
    try {
        const trackIdQuery = await trackSQLServerDB.getTrackByTitle(request.params.trackTitle);
        const trackId = trackIdQuery.trackId;
        console.log(trackId)
        const queryResult = await trackImageModel.insertTrackImage(imgData, trackId)
        if (queryResult)
            return response.status(201).json({ message: "Image Uploaded Successfuly", staus: "ok" })
        else
            return response.status(500).json({ message: "Internal Serval Error" })
    } catch (error) {
        return response.status(500).json({ error: 'Error in uploading the image' })
    }
}

///////////////////////////////////////--update track image--////////////////////////////////////////
exports.updateTrackImage = async (req, res) => {
    try {
        const trackId = 49
        const imgData = req.file.buffer
        const queryResult = await trackImageModel.updateTrackImageByID(trackId, imgData)
        if (queryResult)
            return res.status(201).json({ message: "Image Uploaded Successfuly", staus: "ok" })
        else
            return res.status(500).json({ message: "Internal Serval Error" })
    } catch (error) {
        return res.status(500).json({ error: 'Error in uploading the image' })
    }


}

///////////////////////////////////////--dispaly track image--////////////////////////////////////////
exports.displayTrackImage = async (req, res) => {
    try {
        const trackId = 44; // Assuming trackId is passed as a parameter in the URL
        const queryResult = await trackImageModel.getTrackImageByID(trackId);

        if (queryResult && queryResult.image) {
            // Assuming 'image' is stored as binary data in the database
            res.setHeader('Content-Type', 'image/jpeg'); // Set the appropriate content type
            return res.send(queryResult.image.buffer); // Send the binary image data
        } else {
            return res.status(404).json({ message: "Image not found" });
        }
    } catch (error) {
        console.error('Error displaying track image:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

///////////////////////////////--Track Ilo--//////////////////////////////////////////////////
//////////////------------Add Track ILO------------////////////////////
exports.addTrackIlo = async (request, response) => {
    try {
        const trackOutcome = request.body.trackOutcome;
        const trackType = request.body.trackType;
        const trackId = request.body.trackId;
        const trackDescription = request.body.trackDescription;
        const addTrackIlo = await trackIloSQLServerDB.addTrackIlo(trackOutcome, trackType,
            trackId,
            trackDescription
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
    return response.status(200).json({ status: "OK" });
};

//////////////------------update Track ILO------------////////////////////
exports.updateTrackIlo = async (req, res) => {
    try {
        const trackIloId = req.params.trackIloId;
        const updateData = req.body;

        if (!trackIloId || !updateData) {
            return res.status(400).json({ error: 'Track ID and update data must be provided.' });
        }

        await trackIloSQLServerDB.updateTrackIlo(trackIloId, updateData);
        if (req.file) {
            console.log("the new file", req.file)
            const imageFile = req.file.buffer;
            imageId = await trackImageModel.updateTrackImageByID(parseInt(trackIloId, 10), imageFile);
        }


        return res.status(200).json({ status: "OK", message: 'Track ILO updated successfully.' });
    } catch (error) {
        console.error('Error updating Track ILO:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

//////////////------------Delete Track ILO------------////////////////////
exports.deleteTrackIlo = async (request, response) => {
    try {

        const trackIloId = request.params.trackIloId;

        const deleteTrackIlo = await trackIloSQLServerDB.deleteTrackIlo(trackIloId);


        return response.status(200).json({ status: "ok", message: "Track Ilo Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

//////////////------------get Track ILO------------////////////////////
exports.getTrackIlo = async (request, response) => {
    console.log("the method is entered");
    try {
        const trackId = request.params.trackId;

        const trackIloDetailsArray = await trackIloSQLServerDB.getTrackIloDetails(trackId);

        if (!trackIloDetailsArray || trackIloDetailsArray.length === 0) {
            return response.status(404).json({
                status: "Error",
                message: "Track ILO details not found for the given track ID"
            });
        }

        const trackIloDetails = trackIloDetailsArray.map(row => new TrackIlo(row[0], row[1], row[2], row[3], row[4]));

        return response.status(200).json({
            status: "OK",
            trackIloDetails
        });
    } catch (error) {
        console.error("Error retrieving Track ILO details:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////-----Course-----////////////////////////////////////////////////////

//////////////------------add course to a track with image ------------////////////////////
exports.getExistingCourses = async (request, response) => {
    try {
        // Get all existing courses
        const existingCourses = await courseSQLServerDB.getAllCourses();

        // Loop through each course to get its image
        for (let i = 0; i < existingCourses.length; i++) {
            const courseId = existingCourses[i].courseId;

            // Retrieve the image associated with the course
            const courseImageQuery = await CourseImageModel.getCourseImageByID(courseId);

            if (courseImageQuery && courseImageQuery.image) {
                // Convert image buffer to base64 string
                const base64Image = Buffer.from(courseImageQuery.image.buffer).toString('base64');
                existingCourses[i].courseImage = base64Image;
            } else {
                // If image not found, set image to null
                existingCourses[i].courseImage = null;
            }
        }

        // Return the response with the existing courses and their images
        return response.status(200).json({
            status: "OK",
            message: `Existing courses retrieved successfully`,
            existingCourses
        });

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};


exports.addCourseToTrack = async (request, response) => {
    try {
        const courseType = request.body.courseType;

        if (courseType === "existing") {
            const trackId = request.body.trackId;

            const getTrackQuery = await trackSQLServerDB.getTrackById(trackId);
            if (!getTrackQuery) {
                return response.status(404).json({
                    status: "Error",
                    message: "Track not found"
                });
            }
            const courseId = request.body.courseId
            const addCourseandTrack = await courseSQLServerDB.addCourseToTrack(courseId, trackId)

        } else if (courseType === "new") {


            const trackId = request.body.trackId;
            const imgData = request.file.buffer;
            const courseName = request.body.courseName;
            const courseLevel = request.body.courseLevel;
            const courseHours = request.body.courseHours

            // Check if the track exists
            const getTrackQuery = await trackSQLServerDB.getTrackById(trackId);
            if (!getTrackQuery) {
                return response.status(404).json({
                    status: "Error",
                    message: "Track not found"
                });
            }

            // Check if the new course already exists
            const nameFilter = await courseSQLServerDB.getCourseByName(courseName);
            if (nameFilter) {
                return response.status(400).json({
                    status: "Error",
                    message: "This course already exists"
                });
            }


            const newCourseAdd = await courseSQLServerDB.addCourse(courseName, courseLevel, courseHours)

            const courseIdQuery = await courseSQLServerDB.getCourseByName(courseName);
            console.log(courseIdQuery)
            const courseId = courseIdQuery.courseId;
            console.log(courseId)
            const courseImageAddition = await CourseImageModel.insertCourseImage(courseId, imgData)
            const addCourseandTrack = await courseSQLServerDB.addCourseToTrack(courseId, trackId)
        }

        return response.status(200).json({
            status: "OK",
            message: `new Course added successfully`
        });


    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};


//////////////-----------get All TrackILO Connected With This Course------------///////////////////
exports.getAllTrackILOConnectedWithThisCourse = async (request, response) => {
    try {
        const courseId = request.params.courseId;

        // Fetch all track ILOs linked with the course
        const weights = await courseSQLServerDB.getAllTrackIOsLinkedWithCourse(courseId);

        // Access the rows from the output
        const rows = weights.rows;
        console.log("Weights:", rows);

        // Initialize an array to store the weights
        const weightArray = [];

        // Process the data and populate the weight array using a for...of loop
        for (const row of rows) {
            const trackILOId = row[0];
            const courseId = row[1];
            const weight = row[2];
            const trackIloGetQuery = await trackIloSQLServerDB.getTrackILOById(trackILOId);

            weightArray.push({
                trackILOId: trackILOId,
                trackIloOutcome: trackIloGetQuery.trackOutcome,
                courseId: courseId,
                weight: weight
            });
        }

        console.log('weight array **** ', weightArray)
        return response.status(200).json({
            status: "OK",
            message: "Weights retrieved successfully",
            weightArray: weightArray // Send the weight array in the response
        });
    } catch (error) {
        console.error("Error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}


//////////////-----------get All Course Connected With This TrackILo------------///////////////////
exports.getCoursesConnectedWithThisTrackILO = async (request, response) => {
    try {
        const trackIloId = request.params.trackIloId;

        // Fetch all courses linked with the track ILO
        const coursesData = await courseSQLServerDB.getAllCoursesLinkedWithTrackIlo(trackIloId);

        // Initialize an array to store the courses
        const coursesArray = [];

        // Extract course data from the rows
        const rows = coursesData.rows;
        if (rows.length > 0) {
            for (const row of rows) {
                const courseId = row[1]; // Index 1 corresponds to COURSE_ID_FK
                console.log(courseId)
                // Fetch course details using courseId
                const course = await courseSQLServerDB.getCourseById(courseId);
                if (course) {
                    // Retrieve course image by courseId
                    const courseImageQuery = await CourseImageModel.getCourseImageByID(courseId);
                    if (courseImageQuery !== null && courseImageQuery.image) {
                        // Convert course image buffer to base64 string
                        const base64CourseImage = Buffer.from(courseImageQuery.image.buffer).toString('base64');
                        course.courseImage = base64CourseImage;
                    } else {
                        // If course image not found, set course image to null
                        course.courseImage = null;
                    }

                    // Add course data to the courses array
                    coursesArray.push(course);
                } else {
                    console.error(`Course with ID ${courseId} not found.`);
                }
            }
        } else {
            console.error('No courses linked with the track ILO.');
        }

        console.log('Courses array:', coursesArray);
        return response.status(200).json({
            status: "OK",
            message: "Courses retrieved successfully",
            coursesArray: coursesArray // Send the courses array in the response
        });
    } catch (error) {
        console.error("Error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}


//////////////-----------get All TrackILO Connected With This Course------------///////////////////
exports.AddcourseWeightToTrackILo = async (request, response) => {
    console.log("AddcourseWeightToTrackILo ennter ******************************")
    try {
        const trackIloId = request.params.trackIloId;
        console.log(trackIloId);
        const weightToAdd = parseInt(request.body.WEIGHT);
        console.log(weightToAdd);
        const courseId = parseInt(request.body.COURSE_ID_FK); // Parse courseId as integer
        console.log(courseId);

        const totalWeight = await courseSQLServerDB.getAllWeightsWithTrackIlo(trackIloId);
        console.log("Total Weight in controller", totalWeight);

        const sumOfWeights = totalWeight + weightToAdd;

        // Check if the sum of weights is under 100
        if (sumOfWeights <= 100) {

            const addWeightQuery = await courseSQLServerDB.addCourseWeight(courseId, weightToAdd, trackIloId);

            return response.status(200).json({
                status: "OK",
                message: "Weight added successfully"
            });
        } else {
            return response.status(400).json({
                status: "Error",
                message: "Total weight exceeds 100"
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}

exports.linkCourseToTrackILO = async (request, response) => {
    try {
        const courseId = request.body.courseId;
        const trackIloId = request.body.trackIloId;

        // Ensure courseId, trackIloId, and weight are provided and are valid integers
        if (isNaN(courseId) || isNaN(trackIloId)) {
            return response.status(400).json({ message: "Invalid input data" });
        }

        // Call your database function to add course to track ILO
        const addCourseandTrack = await courseSQLServerDB.linkCourseToTrackILO(courseId, trackIloId);

        return response.status(200).json({
            status: "OK",
            message: "Link course  successfully"
        });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}



//////////////------------View Courses of the supervisor------------////////////////////
exports.viewCourses = async (request, response) => {
    try {
        const supervisorEmail = request.user.email;
        const emailCheck = await userSQLServerDB.getUserByEmail(supervisorEmail);

        if (!emailCheck) {
            return response.status(404).json({
                status: "Error",
                message: "User not found"
            });
        }

        const id = emailCheck[0];
        const supervisor = new Supervisor(emailCheck[5], emailCheck[7], emailCheck[1], emailCheck[3], emailCheck[4], emailCheck[2], request.user.userType, emailCheck[6]);
        const supervisorCheck = await supervisorSQLServerDB.getSupervisorByID(id);
        const supervisorID = supervisorCheck[0];

        if (!supervisorCheck) {
            return response.status(404).json({
                status: "Error",
                message: "Supervisor not found"
            });
        }

        const courses = await courseSQLServerDB.getAllCoursesForSupervisor(supervisorID);

        for (let i = 0; i < courses.length; i++) {
            const courseId = courses[i].courseId;
            // Retrieve the image associated with the course
            const courseImageQuery = await CourseImageModel.getCourseImageByID(courseId);

            if (courseImageQuery !== null && courseImageQuery.image) {
                // Convert image buffer to base64 string
                const base64Image = Buffer.from(courseImageQuery.image.buffer).toString('base64');
                courses[i].courseImage = base64Image;
            } else {
                // If image courseImage found, set course image to null
                courses[i].courseImage = null;
            }
        }
        return response.status(200).json({ courses });
    } catch (error) {
        console.error(error);
        response.status(500).json({ status: 'Error', message: 'Internal Server Error' });
    }
};

//////////////------------view Courses In Track with image------------////////////////////
exports.viewCoursesInTrack = async (request, response) => {
    try {
        const trackId = request.params.trackId;

        // Fetch all courses ids for the track
        const coursesids = await courseSQLServerDB.getAllCoursesForTrack(trackId);
        let courses = []
        for (let i = 0; i < coursesids.length; i++) {
            const courseId = coursesids[i];

            try {
                const course = await courseSQLServerDB.getCourseById(courseId);

                const courseImageQuery = await CourseImageModel.getCourseImageByID(courseId);

                if (courseImageQuery !== null && courseImageQuery.image) {
                    // Convert image buffer to base64 string
                    const base64Image = Buffer.from(courseImageQuery.image.buffer).toString('base64');
                    course.courseImage = base64Image;
                } else {
                    course.courseImage = null;
                }
                courses[i] = course;
            } catch (error) {
                console.error(`Error fetching course details for courseId ${courseId}:`, error);
                // Handle error fetching course details
            }
        }

        return response.status(200).json({ courses });
    } catch (error) {
        console.error("Error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};


/////////////------------update Course  with image------------////////////////////
exports.updateCourse = async (req, res) => {
    try {
        const courseName = req.params.courseName; // Correctly access courseName from req.params
        const decodedCourseName = decodeURIComponent(courseName);
        console.log("course ", courseName);
        console.log("course decoded", decodedCourseName);
        let updateData

        if (req.body && req.body.updateData) {
            updateData = JSON.parse(req.body.updateData);
            // Use updateData here...
        } else {
            console.error('Missing updateData in request body');
            // Handle the error appropriately (e.g., return a 400 Bad Request)
        }

        const courseIdQuery = await courseSQLServerDB.getCourseByName(decodedCourseName);
        const courseId = courseIdQuery.courseId;
        console.log("course decoded", courseId);

        let imageId;
        if (req.file) {
            console.log("the new file", req.file)
            const imageFile = req.file.buffer;
            imageId = await CourseImageModel.updateCourseImageByID(parseInt(courseId, 10), imageFile);
        }


        console.log(updateData)
        // Update track data only if updateData is not null
        if (updateData !== null && updateData !== undefined || ((updateData.C_NAME == '') && (updateData.COURSE_LEVEL == '') && (updateData.COURSE_HOURS == 0))) {
            await courseSQLServerDB.updateCourse(courseId, updateData);
        }


        return res.status(200).json({ status: 'ok', message: 'course updated successfully.' });
    } catch (error) {
        console.error('Error updating course:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


//////////////------------delete Course------------////////////////////
exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId; // Correctly access courseId from req.params

        if (!courseId) {
            return res.status(400).json({ error: 'Course ID parameter is missing' });
        }

        await courseSQLServerDB.deleteCourse(courseId);

        await CourseImageModel.deleteCourseImageByID(parseInt(courseId, 10));
        return res.status(200).json({ status: 'ok', message: 'Course deleted successfully' });
    } catch (error) {
        console.error("Error in deleteCourseController:", error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



//////////////------------Add Course Ilo------------////////////////////
exports.addCourseIlo = async (request, response) => {
    try {
        const courseOutcome = request.body.courseOutcome;
        const courseType = request.body.courseType;
        const courseId = parseInt(request.body.courseId, 10);
        console.log(courseId)
        const courseIloDescrpition = request.body.courseIloDescription

        console.log(courseIloDescrpition)

        const addCourseIlo = await courseIloSQLServerDB.addCourseIlo(courseOutcome, courseType, courseId, courseIloDescrpition);

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
    return response.status(200).json({ message: "ok" });
};

exports.AddcourseILoWight = async (request, response) => {
    console.log("AddcourseILoWight ennter ******************************")
    try {
        const courseIloIld = request.params.courseIloIld;
        const weightToAdd = parseInt(request.body.WEIGHT);
        console.log(weightToAdd);
        const courseId = parseInt(request.body.COURSE_ID_FK); // Parse courseId as integer
        console.log(courseId);

        const totalWeight = await courseIloSQLServerDB.getAllWeightsWithCourseId(courseId);
        console.log("Total Weight in controller", totalWeight);

        const sumOfWeights = totalWeight + weightToAdd;

        // Check if the sum of weights is under 100
        if (sumOfWeights <= 100) {

            const addWeightQuery = await courseIloSQLServerDB.addCourseIloWeight(courseId, weightToAdd, courseIloIld);

            return response.status(200).json({
                status: "ok",
                message: "Weight added successfully"
            });
        } else {
            return response.status(400).json({
                status: "Error",
                message: "Total weight exceeds 100"
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}

//////////////------------Update Course ILO------------////////////////////
exports.updateCourseIlo = async (req, res) => {
    try {
        const { courseIloId } = req.params;
        const { updateData } = req.body;

        if (!courseIloId || !updateData) {
            return res.status(400).json({ error: 'Course ID and update data must be provided.' });
        }

        await courseIloSQLServerDB.updateCourseIlo(courseIloId, updateData);

        return res.status(200).json({ status: "ok", message: 'Course ILO updated successfully.' });
    } catch (error) {
        console.error('Error updating Course ILO:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

//////////////------------delete Course ILO------------////////////////////
exports.deleteCourseIlo = async (request, response) => {
    try {
        const courseIloId = request.params.courseIloId;
        const deleteCourseIlo = await courseIloSQLServerDB.deleteCourseIlo(courseIloId);

        return response.status(200).json({ status: "ok" });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

//////////////------------get Course ILO------------////////////////////
exports.getCourseIlo = async (request, response) => {

    console.log("Entering getCourseIlo method...");
    try {
        const courseId = request.params.courseId;

        const courseIloDetailsQuery = await courseIloSQLServerDB.getCourseIloDetails(courseId);

        const courseIloDetails = courseIloDetailsQuery.map(row => new CourseIlo(row[0], row[2], row[1], row[3], row[4],row[5]));
        if (!courseIloDetails) {
            console.log("Course ILO Details not found.");
            return response.status(404).json({
                status: "Error",
                message: "Course ILO details not found for the given course ID"
            });
        }

        console.log("Returning Course ILO Details:", courseIloDetails);
        return response.status(200).json({
            status: "OK",
            courseIloDetails
        });
    } catch (error) {
        console.error("Error retrieving Course ILO details:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////------------ Course Topic ------------////////////////////

//////////////------------ Add Course Topic ------------////////////////////
exports.addCourseTopic = async (request, response) => {

    const topicName = request.body.topicName;
    const courseId = parseInt(request.body.courseId, 10);
    const courseIloTd = parseInt(request.body.courseIloTd, 10);
    const courseFile = request.file.buffer;
    try {
        const courseTopic = await courseTopicSQLServerDB.addCourseTopic(topicName, courseId, courseIloTd);
        const courseTopicIdQuery = await courseTopicSQLServerDB.getCourseTopicByTopicName(topicName);
        const courseTopicId = courseTopicIdQuery.courseTopicId;
        await courseTopicMongoDB.addCourseTopicToMongo(courseTopicId, courseFile);
        return response.status(200).json({
            status: "OK",
            courseTopic
        });
    } catch (error) {
        console.error("Error adding Course Topic:", error.message);
        response.status(500).send("Internal Server Error");
    }
}

//////////////------------ Get Course Topic ------------////////////////////

exports.getCourseTopics = async (request, response) => {
    console.log("-----------------------------");
    console.log("Entering getCourseTopics method..");
    console.log("-----------------------------");
    try {
        const courseId = request.params.courseId;
        const courseTopicsDetailsQuery = await courseTopicSQLServerDB.getCourseTopicsDetails(courseId);

        const courseTopics = courseTopicsDetailsQuery.map(row => new CourseTopic(row[0], row[1], row[2], row[3]));

        if (!courseTopics || courseTopics.length === 0) {
            console.log("Course topics not found.");
            return response.status(404).json({
                status: "Error",
                message: "Course topics not found for the given course ID"
            });
        }

        let courseTopicsDetails = []
        for (let i = 0; i < courseTopics.length; i++) {
            const courseTopic = courseTopics[i];
            const courseTopicId = courseTopic.courseTopicId;

            try {
                const courseFileQuery = await courseTopicMongoDB.getCourseTopicFromMongo(courseTopicId);

                if (courseFileQuery !== null && courseFileQuery.files) {
                    // Assuming files is an array of File objects
                    const base64Files = Buffer.from(courseFileQuery.files.buffer).toString('base64');
                    courseTopic.files = base64Files;
                } else {
                    courseTopic.files = [];
                }
            } catch (error) {
                console.error(`Error fetching course topic details for courseTopicId ${courseTopicId}:`, error);
                // Handle error fetching course topic details
                // You might want to decide whether to continue or break the loop here
            }
            courseTopicsDetails[i] = courseTopic;


        }

        return response.status(200).json({
            status: "OK",
            courseTopicsDetails
        });
    } catch (error) {
        console.error("Error retrieving course topics:", error);
        response.status(500).json({ status: "Error", message: "Internal Server Error" });
    }
}
exports.updateCourseTopic = async (request, response) => {
    try {
        const courseTopicId = request.params.courseTopicId;
        console.log("Bodyyy", request.body)

        let updateData; // Declare updateData variable

        if (request.body && request.body.updateData) {
            updateData = request.body.updateData;
            // Use updateData here...
        } else {
            console.error('Missing updateData in request body');
            return response.status(400).json({ error: 'Missing updateData in request body' });
        }

        let fileId;
        if (request.file) {

            console.log("fuehfoeifwafwafhwf")
            const newFile = request.file.buffer;
            fileId = await courseTopicMongoDB.editCourseTopicInMongo(courseTopicId, newFile);
        }

        if (updateData) { // Check if updateData exists
            await courseTopicSQLServerDB.updateCourseTopic(courseTopicId, updateData);
        }

        return response.status(200).json({ status: 'ok', message: 'course updated successfully.', fileId });
    } catch (error) {
        console.error('Error updating course:', error);
        return response.status(500).json({ error: 'Internal server error' });
    }
}



exports.deleteCourseTopic = async (request, response) => {
    try {
        const courseTopicId = request.params.courseTopicId; // Correctly access courseId from req.params

        if (!courseTopicId) {
            return res.status(400).json({ error: 'Course ID parameter is missing' });
        }

        await courseTopicSQLServerDB.deleteCourseTopic(courseTopicId);

        await courseTopicMongoDB.deleteCourseTopicInMongo(courseTopicId);
        return response.status(200).json({ status: 'ok', message: 'Course topic deleted successfully' });
    } catch (error) {
        console.error("Error in deleteCourseTopic Controller:", error.message);
        return response.status(500).json({ error: 'Internal server error' });
    }
}






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////// Survey && Feedback ////////////////////////////////////////////////////////////

exports.addSurvey = async (req, res) => {
    try {
        const date = new Date();
        const courseID = req.body.courseID !== undefined ? req.body.courseID : null;
     
        const trackID = req.body.trackID !== undefined ? req.body.trackID : null;

        const instructorID = req.body.instructorID  !== undefined ? req.body.instructorID : null;

        console.log("CID", courseID);
        console.log("TID", trackID);

        const survey = new Survey(null,date,courseID,trackID,null,instructorID);

        const queryResult = await surveySQLServerDB.addSurvey(survey);
        var surveyID;
        if (courseID == null && instructorID == null) {
            surveyID = await surveySQLServerDB.getSurveyId(trackID, "track")
        }
        else if (trackID==null && courseID!==null && instructorID!==null)
        { 
            console.log("Is this working???")
            surveyID = await surveySQLServerDB.getSurveyId(instructorID, "instructor")
            console.log("SURVEY ID = >>> ", surveyID)
        }
        else {
            surveyID = await surveySQLServerDB.getSurveyId(courseID, "course")

        }

        return res.status(200).json({ message: "Survey Added", surveyID: surveyID });
    } catch (error) {
        console.error("Error adding survey:", error);
        return res.status(500).json({ message: "Failed Adding Survey" });
    }
};
exports.addSurveyQuestions = async (req, res) => {
    const { surveyID } = req.params;
    const { questions } = req.body;

    try {
        for (const question of questions) {
            const surveyQuestion = new SurveyQuestion(
                null, // questionID will be null
                surveyID,
                question.question,
                question.q_type
            );

            await surveyQuestionSQLServerDB.addQuestion(surveyQuestion); // Using the controller method
        }

        res.status(200).json({ message: 'Questions added successfully' });
    } catch (error) {
        console.error('Error adding questions:', error);
        res.status(500).json({ message: 'Failed to add questions' });
    }
}
exports.editSurveyQuestions = async (req, res) => {
    try {
        const questions = req.body;

        for (const question of questions) {
            await surveyQuestionSQLServerDB.editQuestion(question.questionID, question.updateData);
        }

        res.status(200).json({ message: 'Survey questions updated successfully' });
    } catch (error) {
        console.error('Error updating survey questions:', error);
        res.status(500).json({ message: 'Failed to update survey questions' });
    }
};


exports.getSurvey = async (req, res) => {
    const { type, id } = req.params;

    try {
        const survey = await SurveyService.getSurvey(id, type);
        return res.status(200).json({ survey });
    } catch (error) {
        console.error("Error retrieving survey:", error.message);
        return res.status(500).json({ message: "Failed retrieving survey" });
    }
}






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////------------ Assesments ------------////////////////////

//////////////------------Add Assesment------------////////////////////

exports.addAssesment = async (request, response) => {
    try {
        const assesmentType = request.body.assesmentType;
        const courseIloId = request.body.courseIloId;
        const addAssesment = await assesmentSQLServerDB.addAssesment(
            assesmentType,
            courseIloId
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
    return response.status(200).json({ message: "ok" });
};


//////////////------------Add Assesment Question------------////////////////////

exports.addAssesmentQuestion = async (request, response) => {
    try {
        const assesmentId = request.body.assesmentId;
        const question = request.body.question;
        const questionType = request.body.questionType;
        const questionLevel = request.body.questionLevel;
        const answerId = request.body.answerId;
        const addAssesmentQuestion = await assesmentSQLServerDB.addAssesmentQuestion(
            assesmentId,
            question,
            questionType,
            questionLevel,
            answerId
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
    return response.status(200).json({ message: "ok" });
};


//////////////------------Add Answer------------////////////////////

exports.addAnswer = async (request, response) => {
    try {
        const assesmentQuestionId = request.body.assesmentQuestionId;
        const answerText = request.body.answerText;
        const correctAnswer = request.body.correctAnswer;
        const addAnswer = await assesmentSQLServerDB.addAnswer(
            assesmentQuestionId,
            answerText,
            correctAnswer
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
    return response.status(200).json({ message: "ok" });
};


exports.addAssesmentQuestionAndCourseTopic = async (request, response) => {
    try {
        const assesmentQuestionId = request.body.assesmentQuestionId;
        const courseTopicId = request.body.courseTopicId;
        const addAssesmentQuestionAndCourseTopic = await assesmentSQLServerDB.addAssesmentQuestionAndCourseTopic(
            assesmentQuestionId,
            courseTopicId
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
    return response.status(200).json({ message: "ok" });
}

//////////////------------delete Assesment------------////////////////////
exports.deleteAssesment = async (request, response) => {
    try {
        const assesmentId = request.params.assesmentId;
        const deleteAssesment = await assesmentSQLServerDB.deleteAssesment(assesmentId);


        return response.status(200).json({ message: "ok" });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};


//////////////------------delete Assesment Question------------////////////////////
exports.deleteAssesmentQuestion = async (request, response) => {
    try {
        const AssesmentQuestionId = request.params.assesmentQuestionId;
        const deleteAssesmentQuestion = await assesmentSQLServerDB.deleteAssesmentQuestion(AssesmentQuestionId);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
    return response.status(200).json({ message: "ok" });
};


//////////////------------delete Answer------------////////////////////
exports.deleteAnswer = async (request, response) => {
    try {
        const answerId = request.params.answerId;
        const deleteAnswer = await assesmentSQLServerDB.deleteAnswer(answerId);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
    return response.status(200).json({ message: "ok" });
};

exports.getAssessments = async (req, res) => {
    try {
        const assessments = await assesmentSQLServerDB.getAssessments();
        return res.status(200).json({ assessments });
    } catch (error) {
        console.error("Error in retrieving Assesments:", error.message); // Log the actual error
        return res.status(500).json({ error: 'Error in retrieving Assesments' });
    }
}

exports.getAssessmentByCourseIloId = async (req, res) => {
    try {
        const CourseIloId = req.params.courseIloId;
        const assesments = await assesmentSQLServerDB.getAssessmentByCourseIloId(CourseIloId);
        res.json(assesments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching assessment questions');
    }
}

exports.getAssessmentQuestions = async (req, res) => {
    try {
        const questions = await assesmentSQLServerDB.getAssessmentQuestions();
        return res.status(200).json({ questions });
    } catch (error) {
        console.error("Error in retrieving Questions:", error.message); // Log the actual error
        return res.status(500).json({ error: 'Error in retrieving Questions' });
    }
}

exports.getAssessmentQuestionsByAssessmentId = async (req, res) => {
    try {
        const assesmentId = req.params.assesmentId;
        const questions = await assesmentSQLServerDB.getAssessmentQuestionsByAssessmentId(assesmentId);
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching assessment questions');
    }
}


exports.getAnswerByAssessmentQuestionId = async (req, res) => {
    try {
        const assesmentQuestionId = req.params.assesmentQuestionId;
        const answer = await assesmentSQLServerDB.getAnswerByAssessmentQuestionId(assesmentQuestionId);
        res.json(answer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching answer');
    }
}


exports.uploadAssessmentFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const filename = req.file.originalname;
        const fileData = req.file.buffer;

        // Call the uploadFile method to upload the file
        const fileId = await assessmentMongoDB.uploadAssessmentFile(filename, fileData);

        // Return success response
        return res.status(200).json({ message: "File uploaded successfully.", fileId: fileId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};




//Amr NEW --------------
exports.getSubmissionsForCourseTopic = async (req, res) => {

    try {
        const courseTopicID = req.params.courseTopicID;
        const submissions = await submissionSQLServerDB.getSubmissionsByCourseTopicID(courseTopicID);
        const studentSubmissions = []
        for (const submission of submissions) {
            const submissionID = submission.submissionID;
            const submissionFile = await submissionMongoDB.getSubmissionBySubmissionID(submissionID);
            const studentSubmission = { submissionData: submission, submissionFile: submissionFile }
            studentSubmissions.push(studentSubmission)
        }
        return res.status(200).json({ submissions: studentSubmissions })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
exports.gradeSubmission = async (req, res) => {
    try {
        const submissionID = req.params.submissionID
        const updateData = req.body
        const queryResults = await submissionSQLServerDB.gradeSubmission(submissionID, updateData)
        return res.status(200).json({ message: "Submission Graded Successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Error Grading Submission" });

    }
}

exports.createAssessment = async (req, res) => {
    try {
        const id = req.user.id;
        const supervisor = await supervisorSQLServerDB.getSupervisorByID(id)
        const supervisorID = supervisor[0]
        console.log("Supervisor ID = ", supervisorID)
        const createdAt = new Date();
        const deadline = new Date(req.body.deadline)
        const courseID = req.params.courseID
        const name = req.body.name
        const type = req.body.type
        const description = req.body.description
        const questions = JSON.parse(req.body.questions)
        console.log("Questions", questions)
        const selectedILOIds = JSON.parse(req.body.selectedILOIds)
        console.log("selectedIlos", selectedILOIds)
        const grade = req.body.grade
        const file = req.file
        console.log("BODY", req.body)
        console.log(1);

        // Wait for the assessment to be added
        const result = await demoAss.addAssessment(name, description, type, createdAt, deadline, true, supervisorID, true, courseID, grade);

        console.log("Results", result);

        if (result.error) {
            // If there's an error, send an error response
            return res.status(500).json({ message: "Failed to add assessment", error: result.error });
        } else {
            // Wait for the assessment ID to be retrieved
            const assessmentID = await demoAss.getAssessmentID(createdAt, deadline, name);



            if (assessmentID !== null) {
                let iloHashMap = {};

                // Iterate over the selectedIlos array
                for (const id of selectedILOIds) {
                    // Set the default value of 0 for each ID
                    iloHashMap[id] = 0;
                }
                if (
                    type === "Assignment/Submission" ||
                    type === "Project"
                ) {
                    const assessmentFile = {
                        assessmentID: assessmentID,
                        type: type,
                        name: name,
                        file: file,
                        courseID: courseID,
                        grade: grade,
                        supervisorID: supervisorID,
                        description: description,
                        deadline: deadline,
                        createdAt: createdAt
                    };
                    const insertFile = await demoMongo.addAssessment(
                        assessmentFile
                    );
                    console.log("InsertFile Results ", insertFile);
                    for (const id of selectedILOIds) {
                        // Set the default value of 0 for each ID
                        iloHashMap[id] = grade / selectedILOIds.length;
                    }

                } else {
                    var totalWeight = 0;
                    for (const question of questions) {
                        totalWeight += question.weight
                        const insetQuestionResult = await demoAss.addQuestion(
                            assessmentID,
                            question,
                            assessmentID
                        );
                    }
                    for (const question of questions) {
                        iloHashMap[question.COURSE_ILO_ID] += question.weight * grade / totalWeight
                    }
                }
                console.log("Hash Map", iloHashMap)
                for (const [key, value] of Object.entries(iloHashMap)) {
                    const keyValue = parseInt(key, 10);
                    const mapValue = value;
                    await demoAss.addAssessmentILO(assessmentID, keyValue, mapValue)
                    // Now you can use keyValue and mapValue variables as needed
                }
                return res
                    .status(200)
                    .json({
                        message: "Assessment added Successfully",
                        results: result.results,
                        id: assessmentID,
                    });
            } else {
                // If assessment ID is null, send an error response
                return res
                    .status(500)
                    .json({ message: "Failed to retrieve assessment ID" });
            }
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error in yourControllerMethod:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
exports.getAllAssessments = async (req, res) => {
    try {
        const courseID = req.params.courseID
        const result = await demoAss.getAssessmentsForCourse(courseID);
        return res.status(200).json({ result });

    } catch (error) {
        // Handle any unexpected errors
        console.error("Error in retrieving assessments for this course:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
exports.getAssessment = async (req, res) => {
    try {
        const assesmentId = req.params.assessmentID
        const result = await demoAss.getAssessmentById(assesmentId);
        return res.status(200).json({ result });

    } catch (error) {
        // Handle any unexpected errors
        console.error("Error in retrieving assessment:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.getUngradedAttempts = async (req, res) => {
    try {
        const courseID = req.params.courseID
        console.log("cid", courseID)
        const results = await demoAss.getUngradedAttempts(courseID)
        return res.status(200).json({ results })
    } catch (error) {
        console.error("Error in retrieving ungraded assessments:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }


}
exports.getEssayQuestionsForAssessment = async (req, res) => {
    try {
        const attemptID = req.params.attemptID
        const results = await demoAss.getEssayAnswersForAssessment(attemptID)
        const totalWeight = await demoAss.getSumOfQuestionWeightsForAssessment(attemptID)
        if (results.error) {
            return res.status(500).json({ message: "Internal Server Error" });

        }
        return res.status(200).json({ results, totalWeight })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });

    }
}
exports.gradeStudentsEssays = async (req, res) => {
    try {
        const attemptID = req.body.attemptID
        const answersData = req.body.answersData
        var extraGrades = 0
        for (const answer of answersData) {
            const id = answer.ANSWER_ID
            const grade = answer.grade
            extraGrades += grade
            const updateGradeResult = await demoAss.setStudentAnswerGrade(id, grade)
            if (updateGradeResult.error) {
                return res.status(500).json({ message: "error updating answer grade " });

            }

        }
        const updateStudentAttemptGrade = await demoAss.updateAssessmentGrade(attemptID, extraGrades)
        if (updateStudentAttemptGrade.error) {
            return res.status(500).json({ message: "error updating student attempt  grade " });

        }
        return res.status(200).json({ message: "Grades have been posted successfully! " })
    } catch (error) {
        console.error("Error in posting results :", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }


}

exports.getInstructorIdForCourse= async(req,res)=> {

    try{
        const courseID = req.params.courseID 
        const instructorID = await courseSQLServerDB.getInstructorIdForCourse(courseID)
        if(instructorID)
            {
                return res.status(200).json({ instructorID})
 
            }

    }catch(error)
    {
        console.error("Error in fetching instructor ID  :", error);
        return res.status(500).json({ message: "Error in fetching instructor ID" });
    }
}




































const wordDict = { 
    "aren't": "are not", 
    "can't": "cannot", 
    "couldn't": "could not", 
    "didn't": "did not", 
    "doesn't": "does not", 
    "don't": "do not", 
    "hadn't": "had not", 
    "hasn't": "has not", 
    "haven't": "have not", 
    "he'd": "he would", 
    "he'll": "he will", 
    "he's": "he is", 
    "i'd": "I would", 
    "i'd": "I had", 
    "i'll": "I will", 
    "i'm": "I am", 
    "isn't": "is not", 
    "it's": "it is", 
    "it'll": "it will", 
    "i've": "I have", 
    "let's": "let us", 
    "mightn't": "might not", 
    "mustn't": "must not", 
    "shan't": "shall not", 
    "she'd": "she would", 
    "she'll": "she will", 
    "she's": "she is", 
    "shouldn't": "should not", 
    "that's": "that is", 
    "there's": "there is", 
    "they'd": "they would", 
    "they'll": "they will", 
    "they're": "they are", 
    "they've": "they have", 
    "we'd": "we would", 
    "we're": "we are", 
    "weren't": "were not", 
    "we've": "we have", 
    "what'll": "what will", 
    "what're": "what are", 
    "what's": "what is", 
    "what've": "what have", 
    "where's": "where is", 
    "who'd": "who would", 
    "who'll": "who will", 
    "who're": "who are", 
    "who's": "who is", 
    "who've": "who have", 
    "won't": "will not", 
    "wouldn't": "would not", 
    "you'd": "you would", 
    "you'll": "you will", 
    "you're": "you are", 
    "you've": "you have", 
    "'re": " are", 
    "wasn't": "was not", 
    "we'll": " will", 
    "didn't": "did not"
} 
const convertToStandard = text => { 
    const data = text.split(' '); 
    data.forEach((word, index) => { 
        Object.keys(wordDict).forEach(key => { 
            if (key === word.toLowerCase()) { 
                data[index] = wordDict[key] 
            }; 
        }); 
    }); 
  
    return data.join(' '); 
} 
  
// LowerCase Conversion 
const convertTolowerCase = text => { 
    return text.toLowerCase(); 
} 
  
// Pure Alphabets extraction 
const removeNonAlpha = text => { 
  
    // This specific Regex means that replace all 
    //non alphabets with empty string. 
    return text.replace(/[^a-zA-Z\s]+/g, ''); 
} 
exports.sentimentAnalysis = async (req, res) => { 
    try {
        const surveyID = req.params.surveyID 
        const Sentianalyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn'); 
        const feedbacks = await feedbackSQLServerDB.getFeedback(surveyID);
        
        let totalScore = 0;
        let count = 0;
        let positiveCount = 0;
        let neutralCount = 0;
        let negativeCount = 0;

        feedbacks.forEach(feedback => {
            feedback.answers.forEach(answer => {
                let sentimentScore;
          
                if (isNaN(answer.ANSWER)) {
                    // NLP Logic for text answers
                    const lexData = convertToStandard(answer.ANSWER);
                    const lowerCaseData = convertTolowerCase(lexData);
                    const onlyAlpha = removeNonAlpha(lowerCaseData);
                    const tokenConstructor = new natural.WordTokenizer(); 
                    const tokenizedData = tokenConstructor.tokenize(onlyAlpha);
                    const filteredData = stopword.removeStopwords(tokenizedData);
                    sentimentScore = Sentianalyzer.getSentiment(filteredData);
                } else {
                    // For numerical answers (0-5), use the number as the sentiment score
                    sentimentScore = parseInt(answer.ANSWER, 10);
                }

                // Categorize sentiment
                if (sentimentScore > 0) {
                    positiveCount++;
                } else if (sentimentScore < 0) {
                    negativeCount++;
                } else {
                    neutralCount++;
                }

                // Attach sentiment score to the answer
                answer.sentiment_score = sentimentScore;

                totalScore += sentimentScore;
                count++;
            });
        });

        const averageSentimentScore = totalScore / count;
        const totalSentiments = positiveCount + neutralCount + negativeCount;
        const positivePercentage = (positiveCount / totalSentiments) * 100;
        const neutralPercentage = (neutralCount / totalSentiments) * 100;
        const negativePercentage = (negativeCount / totalSentiments) * 100;

        let overallSentiment;
        if (positivePercentage > neutralPercentage && positivePercentage > negativePercentage) {
            overallSentiment = "Positive";
        } else if (negativePercentage > positivePercentage && negativePercentage > neutralPercentage) {
            overallSentiment = "Negative";
        } else {
            overallSentiment = "Neutral";
        }

        return res.status(200).json({
            feedbacks,
            average_sentiment_score: averageSentimentScore,
            positive_percentage: positivePercentage,
            neutral_percentage: neutralPercentage,
            negative_percentage: negativePercentage,
            overall_sentiment: overallSentiment
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "error" });
    }
};