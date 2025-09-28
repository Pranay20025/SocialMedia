import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const {socket} = useSelector(store=>store.socketio);
  const {messages} = useSelector(store=>store.chat);
  useEffect(() => {
    socket?.on('newMessage',(newMessage)=>{
      dispatch(setMessages([...messages, newMessage]));
    })
    return () =>{
      socket?.off('newMessage');
    }
    }, [messages, setMessages]); // Add selectedUser and dispatch as dependencies
};

export default useGetRTM;
