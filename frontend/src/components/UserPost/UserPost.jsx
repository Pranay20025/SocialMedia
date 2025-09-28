import React, { useEffect, useState } from 'react';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import "./UserPost.css";
import { FaRegHeart } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import CommentPopup from './CommentPopup';


const UserPost = () => {
  const { id: userId } = useParams();
  useGetUserProfile(userId);
  const { userProfile } = useSelector((store) => store.auth);

  const [selectedPost, setSelectedPost] = useState(null);

  const handleImageClick = (post) => {
    setSelectedPost(post);
  };

  const closePopup = () => {
    setSelectedPost(null);
  };

  return (
    <div className='userPost'>
      <div className='cont'>
        {userProfile && userProfile?.posts?.length > 0 ? (
          userProfile.posts.map((post, index) => (
            <div key={index} className='img-post'>
              <div className="userpostcard" onClick={() => handleImageClick(post)}>
                <img src={post.image} alt="" width={300} />
              </div>
              <div className="post-info">
                <div className="comments-post">
                  <FaRegComment style={{color:"white"}}/> {post.comments.length}
                </div>
                <div className="likes-post">
                  <FaRegHeart style={{color:"white"}}/> {post.likes.length}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No posts available or loading...</div>
        )}
      </div>
      {selectedPost && (
        <CommentPopup post={selectedPost} onClose={closePopup} />
      )}
    </div>
  );
  
};

export default UserPost;
