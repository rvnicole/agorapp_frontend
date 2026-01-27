import type { StateCreator } from "zustand";

export interface IThemeSlice {
    theme: string,
    setTheme: (theme: string) => void;
}

export const ThemeSlice: StateCreator<IThemeSlice> = (set) => ({
    theme: "",
    setTheme: (theme) => {
        set({
            theme
        });

        // Actualizar el tema de la app al que selecciono el usuario
        const body = document.querySelector("body");
        if(body) {
            body.setAttribute("data-theme", theme);
            body.classList.toggle("dark", theme === "dark");
        }
    }
});