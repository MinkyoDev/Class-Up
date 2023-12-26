import React, { useState, useEffect } from 'react';
import { fetchAllFreeboardPosts } from '../services/apiService';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

const PostList = ({ onSelectPost }) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllPosts = async () => {
      const allPosts = await fetchAllFreeboardPosts();
      setPosts(allPosts);
    };
    getAllPosts();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/freeboard/${postId}`); // 게시글 상세 페이지로 이동
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

  return (
    <div>
      <MDBTable>
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {posts.map((post) => (
          <tr key={post.post_id}>
            <td>{post.post_id}</td>
            <td onClick={() => onSelectPost(post.post_id)}>
                {post.title}
            </td>
            <td>{post.user_name}</td>
            <td>{formatDateTime(post.updated_at)}</td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
    </div>
  );
};

export default PostList;