import axios, { AxiosError } from "axios";

let retryRefreshToken = true;

const agorappApi = axios.create({
    baseURL: import.meta.env.VITE_AGORAPP_API_BACKEND,
    timeout: 10000,
    withCredentials: true
});

agorappApi.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {

        if( error.status === 401 && retryRefreshToken && !error.config?.url?.includes("/auth-refresh")){
            console.log("refrescando");
            retryRefreshToken = false;
            const url = "/auth-refresh"
            const res = await agorappApi.get(url);
            if( !res.status ){
                return res; 
            };
            if( error.config ) {
                retryRefreshToken = true;
                return await agorappApi(error.config);
            };
        }
        else if( error.status === 401 && error.config?.url?.includes("/auth-refresh") ){
            localStorage.removeItem("userData");
            window.location.reload();
        }
        else{
            retryRefreshToken =  true;
            throw error;
        };
    }
);

export { agorappApi };