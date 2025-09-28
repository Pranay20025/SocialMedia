import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./Login.css"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

const Login = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector(store=>store.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/v1/user/login", formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
  
      if (response.data.success) {
        dispatch(setAuthUser(response.data.user));
        navigate("/");
      } else {
        console.log(response.data.message); // Log the error message from the backend
        alert(response.data.message); // Display the error message to the user
      }
  
      setFormData({
        email: '',
        password: '',
      });
    } catch (error) {
      console.error("Login Error:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(()=>{
    if(user){
      navigate("/");
    }
  },[]);

  return (
    <div className='login'>
      <div className="login_container">
        <h2>LOGO</h2>
        <p>Login to see photos and videos of your friends</p>
        <form onSubmit={onSubmitHandler}>
          <label>Email</label>
          <input
            type="email" // Changed to "email" for better validation
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={onChangeHandler}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'} {/* Disable button and show loading state */}
          </Button>
        </form>
        <div className="spaan">
        <span>Doesn't have an account ? <Link to={"/signup"} className='bluetext'>Signup</Link></span>
        </div>
      </div>
    </div>
  )
}

export default Login;
