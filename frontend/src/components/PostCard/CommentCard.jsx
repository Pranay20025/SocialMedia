import React from 'react';
import "./Postcard.css";


const CommentCard = ({ comment, index}) => {
  return (
    <div key={index} className="comment-card">
      <img src={comment.author.profilePicture} alt="user" className="comment-avatar" />
      <div className="comment-content">
        <span className="comment-user">{comment.author.userName}</span>
        <span className="comment-text">{comment.text}</span>
      </div>
     
    </div>
  );
};

export default CommentCard;
