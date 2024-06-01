import Course from "./Course";

interface CourseDAO { 
    addCourse(courseName:string, courseLevel:number, courseHours:number): Promise<void> ;
    getCourseByName(courseName: String): Promise<Course | null>;
    getAllCourses(): Promise<Course[]>;
    getAllCoursesForTrack(trackId: number): Promise<Course[]>;
    getAllCoursesForSupervisor(supervisorId: number): Promise<Course[]>;
    deleteCourse(courseId: number): Promise<void>;
    updateCourse(courseId: number, updateData: any): Promise<void>;
}

export default CourseDAO;