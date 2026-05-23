export interface UserModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
}