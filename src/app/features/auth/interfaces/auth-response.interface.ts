import { UserModel } from '../models/user.model';

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
    user: UserModel;
}