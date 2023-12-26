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
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    try {
      await addComment({ post_id: postId, content: newComment });
      setNewComment('');
      // Reload comments to display the new one
      const fetchedComments = await fetchComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('댓글 추가 중 오류가 발생했습니다.');
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

  return (
    <div>
      <h3>댓글</h3>
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <strong>{comment.user_name} :</strong> {comment.content}
            </div>
            <div style={{ whiteSpace: 'nowrap', marginLeft: '10px', fontSize: '0.8rem', color: 'gray' }}>
              {formatDateTime(comment.updated_at)}
            </div>
          </div>
        ))
      ) : (
        <p>댓글이 없습니다.</p>
      )}
      <form onSubmit={handleCommentSubmit} style={{ display: 'flex', alignItems: 'center' }}>
        <MDBInput
          label='댓글은 또 다른 나입니다 ..'
          textarea='true'
          rows='4'
          style={{ flex: 1, marginRight: '10px' }} // flex: 1로 설정하여 입력 필드가 남은 공간을 모두 차지하도록 함
          value={newComment}
          onChange={handleCommentChange}
        />
        <MDBBtn type='submit' style={{ width: '80px' }}>등록</MDBBtn> {/* 버튼 너비 고정 */}
      </form>
    </div>
  );
};

export default CommentsSection;