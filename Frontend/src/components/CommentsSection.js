import React, { useState, useEffect } from 'react';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { fetchComments, addComment } from '../services/apiService';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchComments(postId);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    loadComments();
  }, [postId]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment({ post_id: postId, content: newComment });
      setNewComment('');
      // Reload comments to display the new one
      const fetchedComments = await fetchComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment, index) => (
        <div key={index}>
          <p><strong>{comment.user_name}:</strong> {comment.content}</p>
        </div>
      ))}
      <form onSubmit={handleCommentSubmit}>
        <MDBInput
          label='Add a comment'
          textarea
          rows='4'
          value={newComment}
          onChange={handleCommentChange}
        />
        <MDBBtn type='submit'>Submit Comment</MDBBtn>
      </form>
    </div>
  );
};

export default CommentsSection;