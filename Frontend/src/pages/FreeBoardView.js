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

const serverURL = 'http://221.163.19.218:7783/'; // 서버 URL

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

    function formatDateTime(dateTimeStr) {
      const date = new Date(dateTimeStr);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
    
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  
    if (!post) return <div>로딩중</div>;
  
    return (

      <>
          <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
          <div className="main-content">
          <div>
            <h1>{post.title}</h1>
            <p>작성자 : {post.user_name}</p>
            <p>작성일 : {formatDateTime(post.created_at)}</p>
            <div>{post.content}</div>
            <img
                src={post.image_url ? serverURL + post.image_url : post.image_url}
                alt="Post"
                style={{ maxWidth: '50%' }}
                // className='rounded-circle'
            />
            </div>
          <div className='mt-5'>
            <CommentsSection postId={postId} /> {/* 댓글 섹션 추가 */}
          </div>
          </div>
        </div>
      </div>
        </>

    );
  };

export default FreeBoardView;