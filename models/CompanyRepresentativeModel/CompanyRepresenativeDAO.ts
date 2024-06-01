import CompanyRepresenative from "./CompanyRepresenative";

interface CompanyRepresenativeDAO { 
    addCompanyRepresenative(id: number,specialization:String): Promise<void>;
    getCompanyRepresenativeByID(id: number): Promise< CompanyRepresenative | null>;
    getAllCompanyRepresenatives(): Promise<CompanyRepresenative[]>;
    deleteCompanyRepresenative(id:number): void;
    updateCompanyRepresenative(supervisorEmail:string, edit:any): Promise<void>;
}

export default CompanyRepresenativeDAO;