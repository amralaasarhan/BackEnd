import CompanyRepresenative from "./CompanyRepresenative";
import CompanyRepresenativeDAO from "./CompanyRepresenativeDAO";

class CompanyRepresenativeMongoDB implements CompanyRepresenativeDAO {
  addCompanyRepresenative(id: number, specialization: String): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getCompanyRepresenativeByID(id: number): Promise<CompanyRepresenative | null> {
    throw new Error("Method not implemented.");
  }
  getAllCompanyRepresenatives(): Promise<CompanyRepresenative[]> {
    throw new Error("Method not implemented.");
  }
  deleteCompanyRepresenative(id: number): void {
    throw new Error("Method not implemented.");
  }
  updateCompanyRepresenative(supervisorEmail: string, edit: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
 

}
export default CompanyRepresenativeMongoDB;
