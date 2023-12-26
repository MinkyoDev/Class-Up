import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';

const Logout = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useUserContext();

  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // localStorage에서 사용자 정보 제거
    setUserInfo(null); // 사용자 상태 업데이트
    navigate('/login'); // 로그인 페이지로 리디렉션
  };

  const handleUpdate = () => {
    navigate('/userUpdate'); // 로그인 페이지로 리디렉션
  };

  return (
    <>
    <div className="d-grid gap-2">
    <MDBBtn onClick={handleUpdate} className='ms-0' color='info'>정보수정</MDBBtn>
    <MDBBtn onClick={handleLogout} className='ms-0' color='danger'>로그아웃</MDBBtn>
    </div>
    </>
  );
};

export default Logout;