import type { StateCreator } from "zustand";
import type { Message } from "../types";

export interface IMessageSlice {
    messages: Message[];
    showMessages: (type: Message['type'], text: string) => void;
    removeMessages: (id: string) => void;
    clearMessages: () => void;
}

export const  MessageSlice: StateCreator<IMessageSlice> = (set) => ({
    messages: [],
    showMessages: (type, text) => {
        const id = crypto.randomUUID();

        set(m => ({
            messages: [
                ...m.messages,
                { id, type, text },
            ],
        }));

        setTimeout(() => {
            set((state) => ({
                messages: state.messages.filter((m) => m.id !== id),
            }));
        }, 60000);
    },
    removeMessages: (id) => {
        set((state) => ({
            messages: state.messages.filter(m => m.id !== id)
        }));
    },
    clearMessages: () => {
        set({ messages: [] });
    }
});