import Student from "./Student";

interface  StudentDAO { 
    addStudent(id:number): Promise<void>;
    getStudentByID(id: number): Promise<Student | null>;
    getAllStudents(): Promise<Student[]>;
    deleteStudent(id:number): void;
    updateStudent(studentEmail:string, edit:any): Promise<void>;
}

export default StudentDAO;