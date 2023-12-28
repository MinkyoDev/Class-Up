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
import { fetchFreeboardPost, deleteFreeboardPost } from '../services/apiService';
import CommentsSection from '../components/CommentsSection';
import DOMPurify from 'dompurify'; // DOMPurify 추가
import Markdown from 'markdown-to-jsx'; // 이 라인 추가
import { Viewer } from '@toast-ui/react-editor';

const serverURL = 'http://221.163.19.218:7783/'; // 서버 URL

const FreeBoardView = () => {

    const navigate = useNavigate();

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

    const handleDelete = async () => {
      if (window.confirm('이 게시글을 삭제하시겠습니까?')) {
        try {
          await deleteFreeboardPost(postId);
          navigate('/freeboard'); // 게시글 삭제 후 자유게시판으로 이동
        } catch (error) {
          console.error('Error deleting post:', error);
        }
      }
    };

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

    const contentBoxStyle = {
      border: '4px solid #ccc',
      padding: '20px',
      borderRadius: '10px',
      marginTop: '20px',
      marginBottom: '20px',
      width: '100%', // 너비를 100%로 설정
      boxSizing: 'border-box', // 테두리와 패딩을 너비에 포함
    };
  
    if (!post) return <div>로딩중</div>;
  
    return (

      <>
          <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
          <div className="main-content">
          <div>
            <div className='mb-7'>
            <h1>{post.title}</h1>
            <MDBBtn className='ms-2 float-end' color='danger' onClick={handleDelete}>삭제</MDBBtn>
            <MDBBtn className='ms-2 float-end' onClick={() => navigate(`/updatepost/${postId}`)}>수정</MDBBtn>
            </div>
            <div style={contentBoxStyle}>
            작성자 : {post.user_name}
            <br/>작성일 : {formatDateTime(post.created_at)}
            </div>
            {/* <div dangerouslySetInnerHTML={createMarkup(post.content)} /> */}
            <div style={contentBoxStyle}>
            <Viewer initialValue={post.content} />
            </div>
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