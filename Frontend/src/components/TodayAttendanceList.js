import React, { useEffect, useState } from 'react';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBIcon,
    MDBBadge,
    MDBTable, 
    MDBTableHead, 
    MDBTableBody
  } from 'mdb-react-ui-kit';
import { getDailyAttendance } from '../services/apiService';

const TodayAttendanceList = () => {
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD 형식)
    fetchDailyAttendance(today);
  }, []);

  const fetchDailyAttendance = async (date) => {
    try {
      const data = await getDailyAttendance(date);
      setAttendances(data);
    } catch (error) {
      console.error('Error fetching daily attendance:', error);
    }
  };

  const renderAttendanceState = (state) => {
    switch (state) {
      case 'present':
        return <MDBBadge color='success' pill>출석</MDBBadge>;
      case 'late':
        return <MDBBadge color='warning' pill>지각</MDBBadge>;
      case 'absent':
        return <MDBBadge color='danger' pill>결석</MDBBadge>;
      default:
        return <MDBBadge pill>미정</MDBBadge>;
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
    <MDBTable>
      <MDBTableHead>
        <tr>
            <th scope='col'>사용자</th>
            <th scope='col'>출석 상태</th>
            <th scope='col'>출석 시간</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {attendances.map((attendance, index) => (
          <tr key={index}>
            <td>{attendance.user_name}</td>
            <td>
                {renderAttendanceState(attendance.state)}
            </td>
            <td>{formatDateTime(attendance.time)}</td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
};

export default TodayAttendanceList;