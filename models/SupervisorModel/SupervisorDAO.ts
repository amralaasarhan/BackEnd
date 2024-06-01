import Supervisor from "./Supervisor";

interface SupervisorDAO { 
    addSupervisor(id:number): Promise<void>;
    getSupervisorByID(id: number): Promise< Supervisor | null>;
    getAllSupervisors(): Promise<Supervisor[]>;
    deleteSupervisor(id:number): void;
    updateSupervisor(supervisorEmail:string, edit:any): Promise<void>;
}

export default SupervisorDAO;