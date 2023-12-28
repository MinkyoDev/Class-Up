import React, { useState, useEffect, useRef } from 'react';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchFreeboardPost, updateFreeboardPost } from '../services/apiService';
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const [post, setPost] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await fetchFreeboardPost(postId);
        setPost({ title: fetchedPost.title, content: fetchedPost.content });
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown(post.content);
    }
  }, [post.content]);

  const handleTitleChange = (e) => {
    setPost({ ...post, title: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 제목이 비어있는 경우 alert 창을 띄우고 함수 실행 중단
    if (!post.title.trim()) {
        alert('제목을 입력해주세요.');
        return;
    }

    const editorContent = editorRef.current.getInstance().getMarkdown();

    try {
      await updateFreeboardPost(postId, {
        title: post.title,
        content: editorContent
      });
      navigate(`/freeboard/${postId}`);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <>
    <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
          <div className="main-content">
            <h2>게시글 수정</h2>
            <form onSubmit={handleSubmit}>
              <MDBInput className='mb-4' type='text' name='title' value={post.title} onChange={handleTitleChange} label='제목' />
              <div className="edit_wrap mb-4">
                <Editor
                  initialValue={post.content}
                  previewStyle="vertical"
                  height="600px"
                  initialEditType="wysiwyg"
                  useCommandShortcut={false}
                  language="ko-KR"
                  ref={editorRef}
                  hooks={{
                    addImageBlobHook: (blob, callback) => {
                      handleImageUpload(blob, callback);
                      return false; // 기본 이미지 업로드 동작 방지
                    },
                  }}
                />
              </div>
              <MDBBtn type='submit' className='mb-4' block>글 수정</MDBBtn>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePost;