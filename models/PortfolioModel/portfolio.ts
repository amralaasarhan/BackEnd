class Portfolio { 
    id : number | null;
    educationDegree: string;
    academicInstitute : string;
    technicalSkills: string;
    description: string;
    experience: string;
    studentID : number | null
    constructor(id:number|null=null, educationDegree: string, academicInstitute: string, techincalSkills: string, description: string, experience : string,studentID:number|null = null) { 
        this.id=id
        this.educationDegree=educationDegree
        this.academicInstitute=academicInstitute
        this.technicalSkills=techincalSkills
        this.description=description
        this.experience=experience
        this.studentID=studentID
    }
}
export default Portfolio