import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false);
  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  
    if (!formData.userName || !formData.email || !formData.password) {
      alert("Please fill in all fields.");
      return;
    }
  
  
  
    try {
      setLoading(true); 
      const response = await axios.post("http://localhost:8000/api/v1/user/register", formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
  
      if (response.data.success) { // Check for success key in response
        navigate("/");
      } else {
        console.log(response.data.message);
        alert(response.data.message); // Display error message from the backend
      }
  
      setFormData({
        userName: '',
        email: '',
        password: '',
      });
    } catch (error) {
      console.error("Signup Error:", error);
      alert("An error occurred during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className='login'>
      <div className="login_container">
        <h2>LOGO</h2>
        <p>Signup to see photos and videos of your friends</p>
        <form onSubmit={onSubmitHandler}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            name="userName" // Changed to match the state key
            value={formData.userName}
            onChange={onChangeHandler}
          />
          <label>Email</label>
          <input
            type="text"
            placeholder="Email"
            name="email" // Changed to match the state key
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
          <Button type="submit">Sign up</Button> {/* Type should be lowercase 'submit' */}
        </form>
        <div className="spaan">
        <span>Already have an account ? <Link to={"/login"} className='bluetext'>Login</Link></span>
        </div>
     
      </div>
    </div>
  )
}

export default Signup
