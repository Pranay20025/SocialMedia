import Feed from '@/components/Feed/Feed'
import Rightsidebar from '@/components/RightSidebar/Rightsidebar'
import React from 'react'
import "./Home.css"
import useGetAllPost from '@/hooks/useGetAllPost'

const Home = () => {
  useGetAllPost();
  return (
    <div className='homie'>
    <div className="feed">
     <Feed/>
    </div>
    <div className="right-sidebar">
     <Rightsidebar/>
    </div>
    </div>
  )
}

export default Home