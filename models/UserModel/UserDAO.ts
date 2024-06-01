import User from "./User";

interface UserDAO {
    addUser(user: User): Promise<void>;
    login(email: string, pass: String): Promise<{ user: User | null, userId: number | null }>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserByUsername(username: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    updateUser(filter: any, updateData: any): Promise<void>;
    deleteUser(email: string): Promise<void>;
}

export default UserDAO;
