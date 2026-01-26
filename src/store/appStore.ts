import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ThemeSlice, type IThemeSlice } from "./themeSlice";
import { UserSlice, type IUserSlice } from "./userSlice";

export const useAppStore = create (
    persist<IUserSlice & IThemeSlice>(
        (set, get, store) => ({
            ...UserSlice(set, get, store),
            ...ThemeSlice(set, get, store)
        }),
        {
            name: "data-app",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                // Cambiar el tema de la app al seleccionado por el usuario
                const body = document.querySelector("body");
                if(body && state) {
                    const tema = state.theme ? state.theme : "light";
                    body.setAttribute("data-theme", tema);

                    if(tema === "dark") {
                        body.classList.add("dark");
                    }
                    else {
                        body.classList.remove("dark");
                    }
                }
            }
        }
    )
);