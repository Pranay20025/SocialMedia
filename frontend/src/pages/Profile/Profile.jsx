import React, { useState } from 'react';
import './Profile.css';
import { Outlet, useParams } from 'react-router-dom';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { useSelector } from 'react-redux';
import ProfileCard from './ProfileCard';
import ProfileMenu from './ProfileMenu';

const Profile = () => {
 

  const { id: userId } = useParams();
  useGetUserProfile(userId);
  const { userProfile } = useSelector((store) => store.auth);

  return (
    <>
    <div className="profile-container">
      <div className="profilee-card">
      <ProfileCard userProfile={userProfile} />
      </div>
    <div className="post-containerr">
    <hr className='hr' />
    <ProfileMenu/>
    <Outlet/>
    </div>
    </div>
    </>
  );
};

export default Profile;
