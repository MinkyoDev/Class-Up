import React, { useState, useRef } from 'react';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { useUserContext } from '../contexts/UserContext';
import Navbar from '../components/Navbar';
import { createFreeboardPost, uploadImage } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";

const serverURL = 'http://221.163.19.218:7783/'; // 서버 URL

const CreatePost = () => {
  const navigate = useNavigate();
  const editorRef = useRef();
  const [newPost, setNewPost] = useState({ title: '' });

  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 제목이 비어있는 경우 alert 창을 띄우고 함수 실행 중단
    if (!newPost.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    // 에디터의 내용을 가져옵니다.
    const editorContent = editorRef.current.getInstance().getMarkdown();

    try {
      const postData = {
        title: newPost.title,
        content: editorContent,
        // 이미지 URL을 별도로 설정하지 않습니다.
      };

      await createFreeboardPost(postData);
      navigate('/freeboard');
      window.location.reload();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleImageUpload = async (blob, callback) => {
    try {
      const uploadedImage = await uploadImage(blob);
      const imageUrl = serverURL + uploadedImage.file_path; // 서버에서 반환된 이미지 URL
      callback(imageUrl, '이미지 설명'); // 에디터에 이미지 URL 삽입
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <>
      <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
          <div className="main-content">
            <h2>게시글 작성</h2>
            <form onSubmit={handleSubmit}>
              <MDBInput className='mb-4' type='text' name='title' value={newPost.title} onChange={handleChange} label='제목' />
              <div className="edit_wrap mb-4">
                <Editor
                  initialValue=" "
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
              <MDBBtn type='submit' className='mb-4' block>글 작성</MDBBtn>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;