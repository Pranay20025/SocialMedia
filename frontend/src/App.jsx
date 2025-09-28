import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login/Login';
import MainLayout from './pages/Mainlayout/MainLayout';
import Signup from './pages/Signup/Signup';
import Search from './pages/Search/Search';
import Home from './pages/Home/Home';
import Create from './pages/Create/Create';
import Profile from './pages/Profile/Profile';
import UserPost from './components/UserPost/UserPost';
import UserBookmark from './components/UserBookmark/UserBookmark';
import EditProfile from './pages/EditProfile/EditProfile';
import ChatPage from './pages/ChatPage/ChatPage';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const {socket} = useSelector(store=>store.socketio);

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user._id
        },
        transports: ['websocket']
      });

      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if(socket){
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]); // Added user and dispatch to dependency array

  return (
    <>
  <Routes>
  <Route path='/' element={<ProtectedRoutes><MainLayout /></ProtectedRoutes>}>
    <Route index element={<Home />} />
    <Route path='search' element={<Search />} />
    <Route path='create' element={<Create />} />
    <Route path='explore' element={<Home />} />
    <Route path='messages' element={<ChatPage />} />
    <Route path='editprofile' element={<EditProfile />} />

    <Route path='profile/:id' element={<Profile />}>
      <Route index element={<UserPost />} />
      <Route path='userbookmark' element={<UserBookmark />} />
    </Route>

    <Route path='notifications' element={<Home />} />
  </Route>
  <Route path='/login' element={<Login />} />
  <Route path='/signup' element={<Signup />} />
</Routes>

    </>
  );
}

export default App;
