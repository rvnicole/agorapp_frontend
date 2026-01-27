import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ThemeSlice, type IThemeSlice } from "./themeSlice";
import { UserSlice, type IUserSlice } from "./userSlice";
import { MessageSlice, type IMessageSlice } from "./messageSlice";

type AppState = IUserSlice & IThemeSlice & IMessageSlice;
type PersistedState = Pick<AppState, "usuarioId" | "theme">;

export const useAppStore = create<AppState>()(
    persist(
        (...a) => ({
            ...UserSlice(...a),
            ...ThemeSlice(...a),
            ...MessageSlice(...a),
        }),
        {
            name: "data-app",
            storage: createJSONStorage(() => localStorage),
            partialize: (state): PersistedState => ({
                usuarioId: state.usuarioId,
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