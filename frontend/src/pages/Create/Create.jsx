import React, { useRef, useState } from 'react'
import "./Create.css"
import { readFileAsDataURL } from '@/lib/utils';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';



const Create = () => {
  const {posts} = useSelector(store=>store.post);
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) =>{
    const file = e.target.files?.[0];
    if(file){
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }

  const resetForm = () => {
    setFile("");
    setCaption("");
    setImagePreview("");
    imageRef.current.value = ""; // This clears the file input field
  };

  const createPostHandler = async (e) =>{
  const formData = new FormData();
  formData.append("caption",caption);
  if(imagePreview) formData.append("image", file);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/v1/post/addPost", formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });
      if(response.data.success){
        dispatch(setPosts([response.data.post, ...posts]))
        alert("Post Successfully");
        resetForm();
      }
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
      
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className='create'>
      <h1 style={{fontSize:"40px", fontFamily:"Arial"}}>Create New Post</h1>
      <div className="create_continer">
      {
        imagePreview ? (<img src={imagePreview} alt="" width={300} />) : (    <img src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=" alt="" width={300} />)
      }
        <textarea type="text" value={caption} placeholder="Caption" onChange={(e) => setCaption(e.target.value)}/>
        <input ref={imageRef} type="file"  onChange={fileChangeHandler}/>
        <button onClick={()=>imageRef.current.click()}>Select from Computer</button>
        {
          imagePreview ? (<button type="submit" onClick={createPostHandler} className='buttton'>{loading? "Please Wait": "Post"}</button>) : (<></>)
        }
      </div>
    </div>
  )
}

export default Create