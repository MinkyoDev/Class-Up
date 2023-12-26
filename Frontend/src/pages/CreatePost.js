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
import { createFreeboardPost, uploadImage } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {

  const navigate = useNavigate();

  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // 이미지 업로드 및 게시글 작성 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';
      if (imageFile) {
        const uploadedImage = await uploadImage(imageFile);
        imageUrl = uploadedImage.file_path; // 업로드된 이미지의 URL
      }

      const postData = {
        title: newPost.title,
        content: newPost.content,
        image_url: imageUrl
      };

      await createFreeboardPost(postData);
      navigate('/freeboard');
      window.location.reload(); // 게시글 작성 후 새로고침
      
    } catch (error) {
      console.error('Error creating post with image:', error);
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
                  <div className='mb-4'>
                    <input type='file' onChange={handleFileChange} />
                  </div>
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