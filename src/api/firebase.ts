import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { handleApiError } from "./handleAgorappError";

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
const configFirebase = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
const app = initializeApp(configFirebase);
export const messaging = getMessaging(app);

export const getNotificationToken = async () => {
    try{
        const serviceWorker = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        await navigator.serviceWorker.ready;
        const token = await getToken(messaging, {
            vapidKey: vapidKey,
            serviceWorkerRegistration: serviceWorker
        }); 
        return token;
    }
    catch(error){
        handleApiError(error);
    };
};