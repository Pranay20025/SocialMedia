import React from 'react';
import './Feed.css';
import PostCard from '../PostCard/Postcard';
import { useSelector } from 'react-redux';

const Feed = () => {
  const {posts} = useSelector(store=>store.post);
  return (
    <div className="feedk">
      <div className="posting">
        {posts.map((post) => (
          <PostCard post={post} key={post._id} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
