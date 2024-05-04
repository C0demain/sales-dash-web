
export interface IUser {
    email?: string;
    token?: string;
    role?: string;
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