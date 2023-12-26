import React, { useState } from 'react';
import {
  MDBInput,
  MDBBtn
} from 'mdb-react-ui-kit';
import { useUserContext } from '../contexts/UserContext';
import { updateUser, changeProfileImage } from '../services/apiService';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const UserUpdate = () => {

  const serverURL = 'http://221.163.19.218:7783/'; // 서버 URL

  const { userInfo, setUserInfo, logout } = useUserContext();
  const navigate = useNavigate();

  const [updateData, setUpdateData] = useState({
    new_password: '',
    user_name: userInfo.user_name,
    email: userInfo.email,
    phone_number: userInfo.phone_number
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const [previewImage, setPreviewImage] = useState(serverURL + userInfo.profile_image);

  const handleChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(userInfo.user_id, updateData, currentPassword);
      // 업데이트된 정보를 UserContext에 반영
      setUserInfo(response);
      alert('회원 정보가 업데이트되었습니다.');
      handleLogout(); // 정보 수정 후 로그아웃
    } catch (error) {
      console.error('Error updating user:', error);
      alert('회원 정보 업데이트에 실패했습니다.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    // 파일 리더를 사용하여 이미지 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', profileImage);
      const response = await changeProfileImage(formData);
      // 업데이트된 프로필 이미지를 UserContext에 반영
      setUserInfo({...userInfo, profile_image: response.filename});
      alert('프로필 사진이 변경되었습니다.');
      handleLogout(); // 프로필 사진 변경 후 로그아웃
    } catch (error) {
      console.error('Error updating profile image:', error);
      alert('프로필 사진 변경에 실패했습니다.');
    }
  };

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // localStorage에서 사용자 정보 제거
    setUserInfo(null); // 사용자 상태 업데이트
    navigate('/login'); // 로그인 페이지로 리디렉션
  };

  return (
    <>
      <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
          <h1 className='mb-4'>회원 정보 수정</h1>
          <div className="main-content" style={{width:'500px'}}>
          <form onSubmit={handleProfileImageSubmit}>
          <div className='mb-4'>
            {previewImage && (
                <img 
                src={previewImage} 
                alt="Profile Preview" style={{maxHeight: "200px"}} />
              )}
            </div>
            <div className='mb-4'>
              <MDBInput type='file' onChange={handleImageChange} />
              
            </div>
        <MDBBtn type='submit' className='mb-4' block>
          프로필 사진 변경
        </MDBBtn>
      </form>
      <hr className='mb-5'/>
            <form onSubmit={handleSubmit}>
              <MDBInput className='mb-4' type='password' name="currentPassword"
                value={currentPassword}
                onChange={handlePasswordChange} label='현재 비밀번호' />
              <MDBInput className='mb-4' type='password' name="new_password"
                value={updateData.new_password}
                onChange={handleChange} label='변경할 비밀번호' />
              <MDBInput className='mb-4' type='text' name="user_name"
                value={updateData.user_name}
                onChange={handleChange} label='이름' />
              <MDBInput className='mb-4' type='email' name="email"
                value={updateData.email}
                onChange={handleChange} label='E-Mail' />
              <MDBInput className='mb-4' type='text' name="phone_number"
                value={updateData.phone_number}
                onChange={handleChange} label='Phone Number' />
              <MDBBtn type='submit' className='mb-4' block>
                정보 수정
              </MDBBtn>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserUpdate;