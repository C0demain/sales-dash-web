
export interface IUser {
    id?: number;
    email?: string;
    token?: string;
    role?: string;
    name?: string;
}

export interface IContext extends IUser {
    authenticate : (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: () => boolean;
    isSeller: () => boolean;
}

export interface IAuthProvider{
    children: JSX.Element
};