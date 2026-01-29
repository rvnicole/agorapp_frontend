import type { StateCreator } from "zustand";

export interface IUserSlice {
    usuarioId: number,
    setUsuarioId: (id: number) => void;
}

export const UserSlice: StateCreator<IUserSlice> = (set) => ({
    usuarioId: 3,
    setUsuarioId: (id) => {
        set({
            usuarioId: id
        });
    }
});