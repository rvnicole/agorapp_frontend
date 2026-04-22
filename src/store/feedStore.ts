import { create } from "zustand";
import type { NewUbicacionType, PostRespuesta } from "../types";

interface IFeedStore {
    publicaciones: PostRespuesta[],
    coordenadas: NewUbicacionType,
    setPublicaciones: (publicaciones: PostRespuesta[]) => void,
    setCoordenadas: ({ lat, lng }: NewUbicacionType) => void
};

export const useFeedStore = create<IFeedStore>()((set) => ({
    publicaciones: [],
    coordenadas: {
        lat: 0,
        lng: 0
    },
    setPublicaciones: (publicaciones: PostRespuesta[]) => set({ publicaciones: [...publicaciones] }),
    setCoordenadas: ({ lat, lng }: NewUbicacionType) => set({
        coordenadas: { lat, lng }
    })
}));