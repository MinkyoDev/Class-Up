import React from 'react';

const ViewPost = ({ post }) => {
  if (!post) return null;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>작성자: {post.user_name}</p>
      <p>작성일: {new Date(post.created_at).toLocaleDateString()}</p>
      <p>{post.content}</p>
      {post.image_url && <img src={post.image_url} alt="Post" />}
    </div>
  );
};

export default ViewPost;