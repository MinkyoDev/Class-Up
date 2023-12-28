import React, { useState, useEffect } from 'react';
import { fetchAllFreeboardPosts } from '../services/apiService';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
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

  // 페이징 관련 코드
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPagination = pageNumbers.map(number => (
    <MDBPaginationItem key={number} active={number === currentPage}>
      <MDBPaginationLink onClick={() => setCurrentPage(number)} href="#">
        {number}
      </MDBPaginationLink>
    </MDBPaginationItem>
  ));

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
        {currentPosts.map((post) => (
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
    <MDBPagination className='mb-0'>
        <MDBPaginationItem disabled={currentPage === 1}>
          <MDBPaginationLink onClick={() => setCurrentPage(currentPage - 1)} href="#">
            이전
          </MDBPaginationLink>
        </MDBPaginationItem>
        {renderPagination}
        <MDBPaginationItem disabled={currentPage === pageNumbers.length}>
          <MDBPaginationLink onClick={() => setCurrentPage(currentPage + 1)} href="#">
            다음
          </MDBPaginationLink>
        </MDBPaginationItem>
      </MDBPagination>
    </div>
  );
};

export default PostList;