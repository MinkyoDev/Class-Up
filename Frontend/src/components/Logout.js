import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

const Logout = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useUserContext();

  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // localStorage에서 사용자 정보 제거
    setUserInfo(null); // 사용자 상태 업데이트
    navigate('/login'); // 로그인 페이지로 리디렉션
  };

  return (
    <button onClick={handleLogout}>로그아웃</button>
  );
};

export default Logout;