import { create } from "zustand";
import type { UserData } from "../types";

export interface IUserStore {
    user: UserData;
    setUserData: (userData: UserData) => void;
}

export const useUserStore = create<IUserStore>()((set) => ({
    user: {
        email: "",
        nombre: "",
        apellido: "",
        alias: "",
        createdAt: "",
        esp: "",
        url_img: ""
    },
    setUserData: (userData) => {
        set({ user: userData });
    }
}));