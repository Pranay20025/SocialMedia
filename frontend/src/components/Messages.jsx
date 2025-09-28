import React from 'react';
import { useSelector } from 'react-redux';
import './Messages.css';
import useGetAllMessage from '@/hooks/useGetAllMessge'; // Fixed typo
import { Link } from 'react-router-dom';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = ({ selectedUser }) => {
 
  useGetAllMessage();

  const { messages } = useSelector(state => state.chat);
  
  console.log('Redux messages:', messages); 

  if (!selectedUser) {
    return <p>Loading...</p>;
  }

  return (
    <div className='messages-container'>
    
      <div className='message-list'>
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div className='message-item' key={msg._id}>
              <div className='message-content'>
                {msg.message} 
              </div>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
    </div>
  );
};


export default Messages;
