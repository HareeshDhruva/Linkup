import { useEffect } from 'react'
import { useSocketContext } from '../context/socketContext'
import useConversation from '../zustand/useConversation';

const useListernMessage = () => {
    const {socket} = useSocketContext();
    const {messages, setMessages} = useConversation();
    useEffect(()=>{
        socket?.on("newMessage",(newMessages)=>{
            const sound = new Audio("messagetone.mp3");
            sound.play();
            setMessages([...messages,newMessages]);
        })
        return ()=> socket?.off("newMessage");
    },[socket,messages,setMessages])
}

export default useListernMessage
