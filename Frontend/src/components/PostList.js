import React, { useState, useEffect } from 'react';
import { fetchAllFreeboardPosts } from '../services/apiService';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const PostList = ({ onSelectPost }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getAllPosts = async () => {
      const allPosts = await fetchAllFreeboardPosts();
      setPosts(allPosts);
    };
    getAllPosts();
  }, []);

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
            <td>{post.title}</td>
            <td>{post.user_name}</td>
            <td>{post.updated_at}</td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
    </div>
  );
};

export default PostList;