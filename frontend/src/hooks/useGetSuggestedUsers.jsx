import { setSuggestedUsers } from '@/redux/authSlice'
import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetSuggestedUsers = () =>{
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/user/suggested', { withCredentials: true });
        if (response.data.success) {
          console.log(response.data.users);
          dispatch(setSuggestedUsers(response.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllUsers();
  }, []); // Explicitly add dispatch in the dependency array
  
}

export default useGetSuggestedUsers;