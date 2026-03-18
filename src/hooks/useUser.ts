import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../store/userStore";
import { getUserData } from "../api/userAPI";

export function useUser(){
    const getUserFromServer = async () => {
        const { data, isLoading, isError } = useQuery({
            queryKey: ["getUserData"],
            queryFn: getUserData,
            retry: false
        });

        return { data, isLoading, isError };
    };

    const getUserFromStore = () => {
        const { user } = useUserStore();
        return user.email ? user : null;
    };

    const getUserFromStorage = () => {
        const userData = localStorage.getItem("userData");
        return userData ? JSON.parse(userData) : null;
    };

    const getUserPreferences = () => {
        const preferencias = localStorage.getItem("preferencias");
        return preferencias ? JSON.parse(preferencias) : null;
    };

    return { getUserFromServer, getUserFromStore, getUserFromStorage, getUserPreferences };
};