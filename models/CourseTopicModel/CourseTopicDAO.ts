import Course from "../CourseModel/Course";

interface CourseTopicDAO { 
    addCourseTopic(topicName: string,courseId: number,courseIloId: number):Promise<void>;
    deleteCourseTopic(courseId: number): Promise<void>;
}

export default CourseTopicDAO;