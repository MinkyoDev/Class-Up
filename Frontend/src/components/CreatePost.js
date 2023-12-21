import React, { useState } from 'react';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { createFreeboardPost } from '../services/apiService';

const CreatePost = () => {
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
      window.location.reload(); // 게시글 작성 후 새로고침
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <MDBInput className='mb-4' type='text' name='title' value={newPost.title} onChange={handleChange} label='제목' />
        <MDBInput className='mb-4' type='text' name='content' value={newPost.content} onChange={handleChange} label='내용' />
        <MDBInput className='mb-4' type='text' name='image_url' value={newPost.image_url} onChange={handleChange} label='이미지 URL' />
        <MDBBtn type='submit' className='mb-4' block>글 작성</MDBBtn>
      </form>
    </div>
  );
};

export default CreatePost;