import Course from "../CourseModel/Course";
import Instructor from "./instructor";

interface  InstructorDAO { 
    addInstructor(id:number): Promise<void>;
    getInstructorByID(id: number): Promise<Instructor | null>;
    getAllInstructors(): Promise<Instructor[]>;
    deleteInstructor(id:number): void;
    updateInstructor(InstructorEmail:string, edit:any): Promise<void>;
    assignCourse(id: number, course : Course):  Promise<void>;
}

export default InstructorDAO;