import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.auth);

  useEffect(() => {
    // Only fetch messages if selectedUser exists
    if (!selectedUser?._id) return;

    const fetchAllMessage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/message/all/${selectedUser._id}`,
          { withCredentials: true }
        );
        
        // Log the entire response to check its structure
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          dispatch(setMessages(response.data.message)); // Check if `message` contains the messages
        } else {
          console.log("Failed to fetch messages.");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    

    fetchAllMessage();
  }, [selectedUser, dispatch]); // Add selectedUser and dispatch as dependencies
};

export default useGetAllMessage;
