import React, { useState, useEffect } from 'react';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
  } from 'mdb-react-ui-kit';
import { useUserContext } from '../contexts/UserContext';
import Navbar from '../components/Navbar';
import { createFreeboardPost, fetchAllFreeboardPosts } from '../services/apiService';
import CreatePost from './CreatePost';
import PostList from '../components/PostList';
import ViewPost from './FreeBoardView';
import { useNavigate } from 'react-router-dom';

const FreeBoard = () => {
    
    const navigate = useNavigate();

    const [selectedPost, setSelectedPost] = useState(null);

    const handleCreatePost = () => {
        navigate('/createpost');
      };

    const handleSelectPost = (postId) => {
        navigate(`/freeboard/${postId}`);
      };
    
      return (
        <>
          <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
          <div className="main-content">
            <h1>자유 게시판</h1>
            <MDBBtn onClick={handleCreatePost} className='me-1 float-end' color='success'>작성</MDBBtn>
            <PostList onSelectPost={handleSelectPost} />
          </div>
        </div>
      </div>
        </>
      );
    };

export default FreeBoard;