import React, { useEffect, useState } from 'react';
import "./ChatPage.css";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '@/redux/authSlice';
import { MessageCircleCode } from 'lucide-react';
import Messages from '@/components/Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState('');
  const dispatch = useDispatch();
  const { user, suggestedusers, selectedUser } = useSelector(store => store.auth);
  const { messages, onlineUsers } = useSelector(store => store.chat);

  const sendMessageHandler = async (receiverId) => {
    // Prevent sending empty messages
    if (!textMessage.trim()) {
      console.log("Message is empty");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update Redux state with new message
        dispatch(setMessages([...messages, response.data.newMessage]));
        setTextMessage(''); // Clear input after sending
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      // Clear selected user on unmount
      if (selectedUser) {
        dispatch(setSelectedUser(null));
      }
    };
  }, [selectedUser, dispatch]);

  return (
    <div className='flex ml-[16%] h-screen'>
      {/* Sidebar */}
      <section className='h-screen'>
        <h1 className='font text-xl mb-4 px-3'>{user.userName}</h1>
        <hr className='hr' />
        <div className='overflow-y-auto h-[80vh]'>
          {suggestedusers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div 
                key={suggestedUser._id} 
                onClick={() => dispatch(setSelectedUser(suggestedUser))} 
                className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'
              >
                <div className="profiledp">
                  <div className='dpcircle'>
                    <img src={suggestedUser.profilePicture} className='dp' alt="user" />
                  </div>
                </div>
                <div className='flex flex-col'>
                  <span className='font-medium'>{suggestedUser?.userName}</span>
                  <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Chat Area */}
      {selectedUser ? (
        <section className='flex-1 border-l flex flex-col h-full'>
          <div className='flex gap-3 items-center px-3 py-2 border-b sticky top-0 bg-white z-10'>
            <div className="profiledp">
              <div className='dpcircle'>
                <img src={selectedUser.profilePicture} className='dp' alt="user" />
              </div>
            </div>
            <div className='flex flex-col'>
              <span>{selectedUser?.userName}</span>
            </div>
          </div>

          {/* Messages component */}
          <Messages selectedUser={selectedUser} />

          {/* Input to send messages */}
          <div className='flex items-center p-4 border-t'>
            <input 
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text" 
              className='input-message' 
              placeholder='Messages...' 
            />
            <button 
              className='send-button' 
              onClick={() => selectedUser && sendMessageHandler(selectedUser._id)}
            >
              Send
            </button>
          </div>
        </section>
      ) : (
        <div className='flex flex-col items-center justify-center mx-auto'>
          <MessageCircleCode className='2w-32 h-32 my-4'/>
          <h1 className='font-medium text-xl'>Your Messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
