import React, { useState } from 'react';
import "./Sidebar.css";
import { IoSearch } from "react-icons/io5";
import { LuHome } from "react-icons/lu";
import { MdOutlineExplore } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useNavigate, Link } from 'react-router-dom';
import { FaRegPlusSquare } from "react-icons/fa";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Sidebar = () => {
  const [active, setActive] = useState('Home');
  const navigate = useNavigate();
  const { user } = useSelector(store=>store.auth);
  const dispatch = useDispatch();

  const handleClick = (menuItem) => {
    setActive(menuItem);
  };
  const handleLogoutClick = async (menuItem) => {
    setActive(menuItem);
    try {
      const response = await axios.get("http://localhost:8000/api/v1/user/logout",{withCredentials: true});
      if(response.data){
        dispatch(setAuthUser(null));
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sidebarr">
      <div className="logo">
        <h1>LOGO</h1>
      </div>
      <ul className="menu">
        <li>
          <Link 
            to="/" 
            className={active === 'Home' ? 'active' : ''} 
            onClick={() => handleClick('Home')}
          >
            <LuHome />Home
          </Link>
        </li>
        <li>
          <Link
            to="/search"
            className={active === 'Search' ? 'active' : ''} 
            onClick={() => handleClick('Search')}
          >
            <IoSearch />Search
          </Link>
        </li>
        <li>
          <Link 
            to="/explore" 
            className={active === 'Explore' ? 'active' : ''} 
            onClick={() => handleClick('Explore')}
          >
            <MdOutlineExplore />Explore
          </Link>
        </li>
        <li>
          <Link 
            to="/messages" 
            className={active === 'Messages' ? 'active' : ''} 
            onClick={() => handleClick('Messages')}
          >
            <FiMessageSquare />Messages
          </Link>
        </li>
        <li>
          <Link 
            to="/notifications" 
            className={active === 'Notifications' ? 'active' : ''} 
            onClick={() => handleClick('Notifications')}
          >
            <FaRegHeart />Notifications
          </Link>
        </li>
        <li>
          <Link 
            to="/create" 
            className={active === 'Create' ? 'active' : ''} 
            onClick={() => handleClick('Create')}
          >
           <FaRegPlusSquare />Create
          </Link>
        </li>
        <li>
          <Link 
            to={`/profile/${user._id}`}
            className={active === 'Profile' ? 'active' : ''} 
            onClick={() => handleClick('Profile')}
          >
            {user?.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" className="profile-pic" />
            ):(<CgProfile/>)}Profile
          </Link>
        </li>
        <li>
          <Link 
            className={active === 'Logout' ? 'active' : ''} 
            onClick={() => handleLogoutClick('Logout')}
          >
            <MdLogout/>Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
