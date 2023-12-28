import React, { useState, useEffect } from 'react';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
  } from 'mdb-react-ui-kit';
import { useUserContext } from '../contexts/UserContext';
import { checkAttendance, getTodayUserAttendance } from '../services/apiService';
import Navbar from '../components/Navbar';
import UserList from '../components/UserList';
import TodayAttendanceList from '../components/TodayAttendanceList'

const Home = () => {
    const { userInfo } = useUserContext();
    const [todayUserAttendance, setTodayUserAttendance] = useState(null);
    const [isAttendanceButtonDisabled, setIsAttendanceButtonDisabled] = useState(false);

    useEffect(() => {
        const checkTodayAttendance = async () => {
            try {
                const todayAttendance = await getTodayUserAttendance();
                setTodayUserAttendance(todayAttendance);
            } catch (error) {
                console.error('Error fetching today attendance:', error);
            }
        };
        checkTodayAttendance();
    }, []);

    useEffect(() => {
        if (todayUserAttendance && todayUserAttendance.length > 0 && ['present', 'late'].includes(todayUserAttendance[0].state)) {
            setIsAttendanceButtonDisabled(true);
        } else {
            setIsAttendanceButtonDisabled(false);
        }
    }, [todayUserAttendance]);

    const handleAttendanceClick = async () => {
        try {
            const result = await checkAttendance();
            console.log(result); // 성공 응답 로그
            // 출석체크 성공 시 추가 작업
            alert('출석이 확인되었습니다.');
            setIsAttendanceButtonDisabled(true);
            window.location.reload();
        } catch (error) {
            console.error('Attendance Check Failed:', error);
            // 서버에서 보낸 상세한 에러 메시지가 있는 경우 사용자에게 알림
            if (error.response && error.response.data && error.response.data.detail) {
                alert('출석에 실패했습니다.', error.response.data.detail);
            }
        }
    };

    return (
        <>
        
        <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
                <div className="main-content">
                <h1>홈 화면</h1>
                    {userInfo && <p>환영합니다, {userInfo.user_name} 님!</p>}
                    <MDBBtn color='success'
                    onClick={handleAttendanceClick} 
                    disabled={isAttendanceButtonDisabled}>
                        출석체크
                        </MDBBtn>
                </div>
                <div>
                    <TodayAttendanceList />
                </div>
            </div>
            
        </div>
        </>
    );
};

export default Home;