import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./EditProfile.css";
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector(store => store.auth);
  const [formData, setFormData] = useState({
    bio: user?.bio,
    gender: user?.gender,
    profilePicture: user?.profilePicture,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState(user?.profilePicture);
  const [loading, setLoading] = useState(false); // Loading state

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      setPreviewImage(URL.createObjectURL(file)); // Update the preview image
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const editHandler = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
  
  
  
    const updatedData = new FormData();
    updatedData.append('bio', formData.bio);
    updatedData.append('gender', formData.gender);
    if (formData.profilePicture !== user.profilePicture) {
      updatedData.append('profilePicture', formData.profilePicture);
    }
  
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/user/profile/edit/${user._id}`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          
        }
      });
      
  
      if (response.data.success) {
        const updateduserData = {
          ...user,
          bio: response.data.user?.bio,
          gender: response.data.user?.gender,
          profilePicture: response.data.user?.profilePicture,
        };
        dispatch(setAuthUser(updateduserData));
        navigate(`/profile/${user._id}`);
        alert("Profile Updated Successfully");
      } else {
        console.log("Failed to update profile:", response.data.message);
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  return (
    <div className='edit-container'>
      <h1>Edit Profile</h1>
      <div className='edit-user'>
        <div className='edit-info'>
          <div className='edit-dp'>
            <img src={previewImage} alt="user" width={100} />
          </div>
          <h2>{user.userName}</h2>
        </div>
        <div>
          <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
          <button onClick={() => imageRef.current.click()} className='edit-btn'>Change Photo</button>
        </div>
      </div>
      <form onSubmit={editHandler}>
        <label htmlFor="Bio">Bio</label>
        <textarea name="bio" value={formData.bio} onChange={onChangeHandler} id=""></textarea>
        <label htmlFor="gender">Gender</label>
        <select name="gender" value={formData.gender} onChange={onChangeHandler} id="">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button className='edit-btn' type='submit' disabled={loading}>
          {loading ? 'Please wait...' : 'Submit'}
        </button>
      </form>
      {loading && <p>Please wait while your profile is being updated...</p>} {/* Loading message */}
    </div>
  );
};

export default EditProfile;
