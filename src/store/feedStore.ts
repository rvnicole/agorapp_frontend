import { create } from "zustand";
import type { NewUbicacionType, PostRespuesta } from "../types";

interface IFeedStore {
    publicaciones: PostRespuesta[],
    coordenadas: NewUbicacionType,
    bounds: { neLat: number, neLng: number, swLat: number, swLng: number },
    setPublicaciones: (publicaciones: PostRespuesta[]) => void,
    setCoordenadas: ({ lat, lng }: NewUbicacionType) => void,
    setBounds: (bounds: IFeedStore["bounds"]) => void;
};

export const useFeedStore = create<IFeedStore>()((set) => ({
    publicaciones: [],
    coordenadas: {
        lat: 0,
        lng: 0
    },
    bounds: { neLat: 0, neLng: 0, swLat: 0, swLng: 0 },
    setPublicaciones: (publicaciones: PostRespuesta[]) => set({ publicaciones: [...publicaciones] }),
    setCoordenadas: ({ lat, lng }: NewUbicacionType) => set({
        coordenadas: { lat, lng }
    }),
    setBounds: (bounds) => set({
        bounds: bounds
    })
}));