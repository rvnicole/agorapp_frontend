import { create } from "zustand";
import type { Message } from "../types";

export interface IMessageStore {
    messages: Message[];
    showMessages: (type: Message['type'], text: string) => void;
    removeMessages: (id: string) => void;
    clearMessages: () => void;
}

export const  useMessageStore = create<IMessageStore>()( (set, get) => ({
    messages: [],
    showMessages: (type, text) => {
        const id = get().messages.length.toString();

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
}));