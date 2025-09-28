import React, { useEffect, useRef } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import './CommentPopup.css';
import axios from 'axios';
import CommentCard from '../PostCard/CommentCard';

const CommentPopup = ({ post, onClose }) => {
  const popupRef = useRef(null);

 const deleteHandler = async () =>{
   try {
  const response = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post._id}`,{withCredentials:true});
  if(response.data.success){
    alert("post deleted successfully");
  }  
  } catch (error) {
    console.log(error);
  }
 } 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!post) return null;

  return (
    <div className="comment-popup">
      <div className="comment-popup-content" ref={popupRef}>
        <div className="comment-image">
          <img src={post.image} alt="Post" />
        </div>
        <div className="comments-section">
          <div className="comment-popup-header">
            <h3>Comments</h3>
            <MdDeleteOutline className="delete-icon" onClick={deleteHandler}/>
          </div>
          <div className="comments-list">
            {post.comments.map((comment, index) => (
              <CommentCard comment={comment} index={index}></CommentCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentPopup;
