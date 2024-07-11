import { create } from 'zustand';

const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    openSignin:false,
    setOpenSignin:(openSignin)=>set({openSignin}),
    openRegister:false,
    setOpenRegister:(openRegister)=>set({openRegister}),
    messages: [],
    setMessages: (messages) => set({ messages })
}));

export default useConversation;
