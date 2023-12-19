import React from 'react';
import { useUserContext } from '../contexts/UserContext';
import { checkAttendance } from '../services/apiService';
import Logout from './Logout';
import Navbar from './Navbar';
import UserList from './UserList';

const Home = () => {
    const { userInfo } = useUserContext();

    const handleAttendanceClick = async () => {
        try {
            const result = await checkAttendance();
            console.log(result); // 성공 응답 로그
            // 출석체크 성공 시 추가 작업
        } catch (error) {
            console.error('Attendance Check Failed:', error);
            // 에러 처리
        }
    };

    return (
        <div className="home-container" style={{ display: 'flex' }}>
            <div className="navbar-container" style={{ width: '20%', marginRight: '20px' }}>
                <Navbar />
            </div>
            <div className="content-container" style={{ width: '80%' }}>
                <div className="main-content">
                    <h1>홈 화면</h1>
                    {userInfo && <p>환영합니다, {userInfo.username}!</p>}
                    <button onClick={handleAttendanceClick}>출석체크</button>
                    <Logout />
                </div>
                <div className="sidebar">
                    <UserList />
            </div>
            </div>
            
        </div>
    );
};

export default Home;