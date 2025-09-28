import React, { useState } from 'react'
import "./Profile.css"
import { Link } from 'react-router-dom';

const ProfileMenu = () => {
  const [menu, setMenu] = useState("posts"); // Corrected state naming

  const onClickMenu = (value) => () => {
    setMenu(value); // Set the state to the clicked menu value
  };
  return (
    <div className="postss">
        <Link
          to={''}
          onClick={onClickMenu("posts")}
          className={menu === "posts" ? "activemenu" : ""}
        >
          Posts
        </Link>
        <Link
         to={`userbookmark`}
          onClick={onClickMenu("bookmark")}
          className={menu === "bookmark" ? "activemenu" : ""}
        >
          Bookmark
        </Link>
      </div>
  )
}

export default ProfileMenu