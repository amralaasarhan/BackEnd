import Admin from "./Admin";

interface AdminDAO { 
    blockUser(username: string): Promise<void>;
    getAdminByID(id: number): Promise<Admin | null>;
}

export default AdminDAO;