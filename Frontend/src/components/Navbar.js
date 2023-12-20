import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import Logout from './Logout';

const serverURL = 'http://221.163.19.218:7783/'; // 서버 URL

const Navbar = () => {

  const { userInfo } = useUserContext();

  const handleImageClick = () => {
    const imageUrl = userInfo.profile_image ? serverURL + userInfo.profile_image : userInfo.profile_image;
    
    // 새 창에서 이미지를 팝업 형태로 보여주기
    window.open(imageUrl, 'Image', 'width=800,height=600'); 
  };

  return (
    <nav style={{textAlign: 'center'}}>
      <h1>CLASSUP</h1>
      <hr/>
      <img
        src={userInfo.profile_image ? serverURL + userInfo.profile_image : userInfo.profile_image}
        alt={userInfo.user_name}
        style={{ width: '100px', height: '100px' }}
        className='rounded-circle'
        onClick={handleImageClick} // 이미지 클릭 이벤트 핸들러 추가
      />
      <hr />
      <Logout />
      <ul className="menu-links mt-3">
        <li><Link to="/">홈</Link></li>
        <li><Link to="/attendance">출석정보</Link></li>
        <li><Link to="/penalty">벌금표</Link></li>
        <li><Link to="/approval">사유신청</Link></li>
        <li><Link to="/study">코테 스터디</Link></li>
        <li><Link to="/Assignment">코테 챌린지</Link></li>
        <li><Link to="/project">프로젝트</Link></li>
        <li><Link to="/calendar">캘린더</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;