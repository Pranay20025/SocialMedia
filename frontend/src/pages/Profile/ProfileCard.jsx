import React, { useState } from 'react';
import "./Profile.css";
import { IoIosSettings } from "react-icons/io";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ userProfile }) => {
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  // Set initial follow state
  const [follow, setFollow] = useState( userProfile.followers.includes(user._id));
const handleFollow = async () => {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/user/followorunfollow/${userProfile._id}`,
      {},
      { withCredentials: true }
    );
    if (response.data.success) {
      setFollow((prevFollow) => !prevFollow); // Use the callback form of setFollow
      console.log('Follow state updated:', !follow);
    }
  } catch (error) {
    console.log('Error in follow/unfollow:', error);
  }
};

  return (
    <div className='profilecard'>
      <div className="profiledp">
        <div className='dpcircle'>
          <img src={userProfile.profilePicture} className='dp' alt="user" />
        </div>
      </div>
      <div className="halfcard">
        <div className="username-prt">
          <h2 className='usernameee'>{userProfile.userName}</h2>
          {user._id === userProfile._id ? (
            <>
              <button onClick={()=>{navigate("/editprofile")}}>Edit Profile</button>
              <button>View Archive</button>
            </>
          ) : (
            <button onClick={handleFollow}>
              {follow ? "Followed" : "Follow"}
            </button>
          )}
          <IoIosSettings className='setting' />
        </div>
        <div className="following-part">
          <p>{userProfile?.posts.length} posts</p>
          <p>{userProfile?.followers.length} followers</p>
          <p>{userProfile?.following.length} following</p>
        </div>
        <div className="bio-part">
          <p>{userProfile?.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
