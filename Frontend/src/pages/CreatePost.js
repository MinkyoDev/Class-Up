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
import { createFreeboardPost } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {

  const navigate = useNavigate();

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image_url: ''
  });

  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFreeboardPost(newPost);
      navigate('/freeboard');
      window.location.reload(); // 게시글 작성 후 새로고침
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const { userInfo } = useUserContext();

    return (
        <>
        
        <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
                <div className="main-content">
                <h2>게시글 작성</h2>
                <form onSubmit={handleSubmit}>
                    <MDBInput className='mb-4' type='text' name='title' value={newPost.title} onChange={handleChange} label='제목' />
                    <MDBInput className='mb-4' type='text' name='content' value={newPost.content} onChange={handleChange} label='내용' />
                    <MDBInput className='mb-4' type='text' name='image_url' value={newPost.image_url} onChange={handleChange} label='이미지 URL' />
                    <MDBBtn type='submit' className='mb-4' block>글 작성</MDBBtn>
                </form>
                </div>
                <div>
                </div>
            </div>
            
        </div>
        </>
    );
};

export default CreatePost;