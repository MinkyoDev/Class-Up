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
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFreeboardPost } from '../services/apiService';
import CommentsSection from '../components/CommentsSection';
const FreeBoardView = () => {

    const { postId } = useParams();
    const [post, setPost] = useState(null);
  
    useEffect(() => {
      const getPostDetail = async () => {
        try {
          const postDetails = await fetchFreeboardPost(postId);
          setPost(postDetails);
        } catch (error) {
          console.error('Error fetching post details:', error);
        }
      };
  
      getPostDetail();
    }, [postId]);
  
    if (!post) return <div>Loading...</div>;
  
    return (

      <>
          <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
          <div className="main-content">
          <div>
            <h1>{post.title}</h1>
            <p>작성자: {post.user_name}</p>
            <p>작성일: {post.created_at}</p>
            <div>{post.content}</div>
            {post.image_url && <img src={post.image_url} alt="Post" />}
          </div>
          <CommentsSection postId={postId} /> {/* 댓글 섹션 추가 */}
          </div>
        </div>
      </div>
        </>

    );
  };

export default FreeBoardView;