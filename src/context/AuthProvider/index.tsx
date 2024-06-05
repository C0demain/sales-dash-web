import React, { createContext, useEffect, useState } from "react";
import { IAuthProvider, IContext, IUser } from "./types";
import { LoginRequest, getUserLocalStorage, setUserLocalStorage } from "../util";

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider = ({ children }: IAuthProvider) => {
    const [user, setUser] = useState<IUser | null>();

    useEffect (() => {
        const user = getUserLocalStorage();

        if(user){
            setUser(user);
        }
    }, []);

    async function authenticate(email: string, password: string) {
        const response = await LoginRequest(email, password);

        const payload = { 
            cpf: response.cpf,
            token: response.token, 
            id: response.userId, 
            role: response.role,
            name: response.name,
            email
        };

        setUser(payload);
        setUserLocalStorage(payload);
    }

    function logout() {
        setUser(null);
        setUserLocalStorage(null);
    }

    function isAdmin(){
        return user?.role === 'admin'
    }

    function isSeller(){
        return user?.role === 'user'
    }

    return (
        <AuthContext.Provider value={{ ...user, authenticate, logout, isAdmin, isSeller }}>
            {children}
        </AuthContext.Provider>
    )
}