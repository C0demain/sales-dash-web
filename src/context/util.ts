import {apiLogin} from "services/api";
import { IUser } from "./AuthProvider/types";

export function setUserLocalStorage(user: IUser | null) {
    localStorage.setItem('userID', JSON.stringify(user?.userID))
    localStorage.setItem('userEmail', JSON.stringify(user?.email))
    localStorage.setItem('userToken', JSON.stringify(user?.token))
}

export function getUserLocalStorage() {
    const json = localStorage.getItem('user')

    if (!json) {
        return null;
    }

    const user = JSON.parse(json);

    return user ?? null;
}

export async function LoginRequest(email: string, password: string) {
    try {
        const request = await apiLogin.post('/login', { email, password })

        return request.data
    } catch (error) {
        return null;
    }
}