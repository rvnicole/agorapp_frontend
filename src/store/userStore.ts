import { create } from "zustand";
import type { UserData } from "../types";

export interface IUserStore {
    user: UserData;
    consulted: boolean;
    setUserData: (userData: UserData) => void;
};

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
    consulted: false,
    setUserData: (userData) => {
        set({ user: userData, consulted: true });
    }
}));