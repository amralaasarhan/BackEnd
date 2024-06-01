import CourseTopic from"../CourseTopicModel/CourseTopic"
import Supervisor from "../SupervisorModel/Supervisor";
const { ObjectId } = require('mongodb')

class Course{
    courseId:number
     courseName: String;
     courseLevel: String;
     courseHours: number;
     courseTopics:CourseTopic[]
     courseImage: string | null; 


    constructor(courseId:number,  courseName: String, courseLevel: String, courseHours: number){
        this.courseId=courseId;
        this.courseName=courseName;
        this.courseLevel=courseLevel;
        this.courseHours=courseHours;
        this.courseImage = null;
        this.courseTopics=[];
    }
}


export default Course