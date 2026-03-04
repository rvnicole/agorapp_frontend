import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ThemeSlice, type IThemeSlice } from "./themeSlice";

type AppState = IThemeSlice;
type PersistedState = Pick<AppState, "theme">;

export const useAppStore = create<AppState>()(
    persist(
        (...a) => ({
            ...ThemeSlice(...a),
        }),
        {
            name: "data-app",
            storage: createJSONStorage(() => localStorage),
            partialize: (state): PersistedState => ({
                theme: state.theme
            }),
            onRehydrateStorage: () => (state) => {
                if (!state) return;

                // Cambiar el tema de la app al seleccionado por el usuario
                const body = document.querySelector("body");
                if(body) {
                    const tema = state.theme ? state.theme : "light";
                    body.setAttribute("data-theme", tema);
                    body.classList.toggle("dark", tema === "dark");
                }
            }
        }
    )
);