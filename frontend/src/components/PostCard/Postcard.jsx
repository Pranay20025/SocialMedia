import React, { useState, useRef, useEffect } from 'react';
import { FaRegHeart, FaRegComment, FaRegShareSquare, FaRegBookmark, FaSmile, FaBookmark } from 'react-icons/fa';
import { IoMdMenu } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { RiUserUnfollowLine } from 'react-icons/ri';
import { MdDeleteOutline } from 'react-icons/md';
import { FcLike } from "react-icons/fc";
import { BiLike } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import './Postcard.css';
import axios from 'axios';
import { setPosts } from '@/redux/postSlice';
import CommentCard from './CommentCard';

const PostCard = ({ post }) => {

  const dispatch = useDispatch();

  const {posts} = useSelector(store=>store.post);
  const {user} = useSelector(store=>store.auth);
  const [bookmarked, setBookmarked] = useState(true);
  const [like, setlike] = useState(post.likes.includes(user?._id) || false);
  const [isCommentPopupOpen, setCommentPopupOpen] = useState(false);
  const [isInnerOptionsPopupOpen, setInnerOptionsPopupOpen] = useState(false);
  const [isOptionsPopupOpen, setOptionsPopupOpen] = useState(false);
  const [optionsPopupPosition, setOptionsPopupPosition] = useState({ top: 0, left: 0 });
  const [postLike, setPostlike] = useState(post.likes.length);
  const commentPopupRef = useRef(null);
  const innerOptionsPopupRef = useRef(null);
  const optionsPopupRef = useRef(null);
  const [commentData , setCommentData] = useState({
    text: "",
  })
  const [comments, setComment] = useState(post.comments);

  const toggleCommentPopup = () => setCommentPopupOpen(!isCommentPopupOpen);
  const openCommentPopup = () => setCommentPopupOpen(true);
  const toggleInnerOptionsPopup = () => setInnerOptionsPopupOpen(!isInnerOptionsPopupOpen);
  const toggleOptionsPopup = (e) => {
    const rect = e.target.getBoundingClientRect();
    setOptionsPopupPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setOptionsPopupOpen(!isOptionsPopupOpen);
  };

   const handleClickOutside = (e) => {
    if (
      (commentPopupRef.current && !commentPopupRef.current.contains(e.target)) ||
      (innerOptionsPopupRef.current && !innerOptionsPopupRef.current.contains(e.target)) ||
      (optionsPopupRef.current && !optionsPopupRef.current.contains(e.target))
    ) {
      setCommentPopupOpen(false);
      setInnerOptionsPopupOpen(false);
      setOptionsPopupOpen(false);
    }
  };

  const deletePostHaandler = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        const updatedPostData = posts.filter((postItem)=>postItem?._id !== post?._id);
        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      console.log(error);
      alert("Can't delete");
    }
  };

  const bookmarkPostHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/bookmark`,{}, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        const { type } = response.data;
        if (type === "saved") {
          setBookmarked(true);
        }
        else{
          setBookmarked(false);
        }
      }
    } catch (error) {
      console.log(error);
      alert("Can't bookmark");
    }
  };
  


  const likeOrDislikePostHandler = async() =>{
    try {
      const action = like ? "dislike" : "like";
      const token = localStorage.getItem("token");
      const respone = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, {
        headers:{
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      if(respone.data.success){
        const updatedlikes = like ? postLike -1 : postLike +1;
        setPostlike(updatedlikes);
        setlike(!like);
      }
    } catch (error) {
      console.log(error);
      
    }
  }


  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    
    setCommentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const commentHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, commentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
  
      if (response.data.success) {
        const updatedCommentData = [...comments, response.data.comment];
        setComment(updatedCommentData);
  
        setCommentData({ text: "" });
        
        alert("Comment Added");
      } else {
        alert("Failed to add comment.");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while adding the comment.");
    }
  };
  

  useEffect(() => {
    if (isCommentPopupOpen || isOptionsPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCommentPopupOpen, isOptionsPopupOpen]);

  

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-user-info">
          <img src={post.author.profilePicture} alt="profile_picture" className="avatar" />
          <div className="username">{post.author.userName}</div>
        </div>
        <BsThreeDots className="three-dots" onClick={toggleOptionsPopup} />
      </div>

      <img src={post.image} alt="post" className="post-image" width={400} onClick={openCommentPopup} />

      <div className="post-footer">
        <div className="actions">
        {like? <FcLike  onClick={likeOrDislikePostHandler} className="icon" />:<FaRegHeart onClick={likeOrDislikePostHandler} className="icon" />}
          <FaRegComment className="icon" onClick={toggleCommentPopup} />
          <FaRegShareSquare className="icon" />
          {bookmarked ? <FaBookmark className="icon rightmost-icon" onClick={bookmarkPostHandler} />:<FaRegBookmark className="icon rightmost-icon" onClick={bookmarkPostHandler} />}
        </div>
        <div className="likes">{postLike} likes</div>
        <div className="caption">
          <span className="username">{post.author.userName}</span> {post.caption}
        </div>
      </div>

      {isCommentPopupOpen && (
        <div className="comment-popup">
          <div className="comment-popup-content" ref={commentPopupRef}>
            <div className="comment-image">
              <img src={post.image} alt="post" width={300} />
            </div>
            <div className="comments-section">
              <div className="comment-popup-header">
                <h4>Comments</h4>
                <IoMdMenu className="menu-icon" onClick={toggleInnerOptionsPopup} />
              </div>
              <div className="comments-list">
                {comments.map((comment, index) => (
                 <CommentCard  comment= {comment} key={index}/>
                ))}
              </div>
              <div className="comment-input-section">
                <FaSmile className="emoji-icon" />
                <input
                  type="text"
                  value={commentData.text}
                  name='text'
                  onChange={handleCommentChange}
                  placeholder="Add a comment..."
                  className="comment-input"
                />
                <button onClick={commentHandler} className="post-button">Post</button>
              </div>

              {isInnerOptionsPopupOpen && (
                <div className="inner-options-popup top-right" ref={innerOptionsPopupRef}>
                  <ul>
                    <li className="unfollow"><RiUserUnfollowLine /> Unfollow</li>
                    <li><BiLike />Add to Favorites</li>
                    {user && user?._id === post?.author._id && <li className="delete" onClick={deletePostHaandler}><MdDeleteOutline /> Delete</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isOptionsPopupOpen && (
        <div
          className="inner-options-popup"
          ref={optionsPopupRef}
          style={{ top: optionsPopupPosition.top, left: optionsPopupPosition.left }}
        >
          <ul>
            <li className="unfollow"><RiUserUnfollowLine /> Unfollow</li>
            <li><BiLike /> Add to Favorites</li>
           {user && user?._id === post?.author._id && <li className="delete" onClick={deletePostHaandler}><MdDeleteOutline /> Delete</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostCard;
