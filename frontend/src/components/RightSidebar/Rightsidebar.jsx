import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';
import React from 'react';
import { useSelector } from 'react-redux';
import "./Rightsidebar.css";
import { useNavigate } from 'react-router-dom';

const Rightsidebar = () => {
  useGetSuggestedUsers();
  const { user, suggestedusers } = useSelector(store => store.auth);
  const navigate = useNavigate();

 

  return (
    <div className='rightsidebar'>
      <div className="myself">
        <div className='profileimg'>
          <img src={user.profilePicture} alt="Profile" />
        </div>
        <div>
          <h2>{user.userName}</h2>
          <p>{user?.bio}</p>
        </div>
      </div>
      <h2>Suggested Users</h2>
      {
        suggestedusers.map((suggestedUser, index) => {
          return (
            <div key={index} className="myself" onClick={()=>{navigate(`/profile/${suggestedUser._id}`)}}>
              <div className='profileimg'>
                <img src={suggestedUser.profilePicture} alt="Profile" />
              </div>
              <div className='info'>
                <h2>{suggestedUser.userName}</h2>
                <p>{suggestedUser?.bio}</p>
              </div>
              <div className='followed'>
              <button className="follow-button">Follow</button>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

export default Rightsidebar;
