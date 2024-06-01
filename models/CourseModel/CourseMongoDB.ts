import Course from "./Course";
import CourseDAO from "./CourseDAO"
import { MongoClient, ObjectId } from "mongodb";

class CourseMongoDB implements CourseDAO {
  addCourse(courseName: string, courseLevel: number, courseHours: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getCourseByName(courseName: String): Promise<Course | null> {
    throw new Error("Method not implemented.");
  }
  getAllCourses(): Promise<Course[]> {
    throw new Error("Method not implemented.");
  }
  getAllCoursesForTrack(trackId: number): Promise<Course[]> {
    throw new Error("Method not implemented.");
  }
  getAllCoursesForSupervisor(supervisorId: number): Promise<Course[]> {
    throw new Error("Method not implemented.");
  }
  deleteCourse(courseId: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  updateCourse(courseId: number, updateData: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  

  
}

export default CourseMongoDB;
