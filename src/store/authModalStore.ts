import { create } from "zustand";

type ActionsType = "default"|"create"|"support"|"comments";

export interface IAuthModalStore {
    openModal: boolean;
    action: ActionsType;
    setOpenModal: (state: boolean) => void;
    setAction: (action: ActionsType) => void;
}

export const useAuthModalStore = create<IAuthModalStore>()((set) => ({
    openModal: false,
    action: "default",
    setOpenModal: (state) => {
        set(om => ({ ...om, openModal: state }));
    },
    setAction: (action) => {
        set(om => ({ ...om, action }));
    }
}));