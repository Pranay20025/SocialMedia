import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export const useGetUserProfile = (userId) =>{
  const dispatch = useDispatch();
  useEffect(()=>{
    const fetchUser = async () =>{
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`,{withCredentials:true});
      if(response.data.success){
        console.log(response.data.user); // Check what data is being returned
        dispatch(setUserProfile(response.data.user)); // Dispatch profile to Redux
      }
    } catch (error) {
      console.error("Error fetching user profile:", error); // Add better error handling
    }
    }
    fetchUser();
  }, [userId, dispatch]) // Add dispatch to dependencies
}

export default useGetUserProfile;
