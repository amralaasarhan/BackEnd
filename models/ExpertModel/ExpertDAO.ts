import Expert from "./Expert";

interface ExpertDAO { 
    addExpert(id: number,specialization:String): Promise<void>;
    getExpertByID(id: number): Promise< Expert | null>;
    getAllExperts(): Promise<Expert[]>;
    deleteExpert(id:number): void;
    updateExpert(supervisorEmail:string, edit:any): Promise<void>;
}

export default ExpertDAO;