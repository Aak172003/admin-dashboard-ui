import { create } from "zustand";

// This is a middleware that will be used to redux devtools the store
import { devtools } from 'zustand/middleware'

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface AuthState {
    user: null | User;
    // This is a function that will be used to set the user in the store
    // Which receives a user object as an argument and returns void
    setUser: (user: User) => void;
    // This is a function that will be used to logout the user
    // Which will set the user to null , and it receives nothing as an argument and returns void
    logout: () => void;
}


export const useAuthStore = create<AuthState>()(
    //    1. devtools middleware
    // wrap all the code in devtools middleware , so we can access the store in redux devtools
    devtools((set) => ({
        user: null,
        setUser: (user) => {
            set({ user: user })
        },
        logout: () => set({ user: null })

    }))
);