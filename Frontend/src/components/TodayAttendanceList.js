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
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.getFullYear() + '-' + 
                           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(today.getDate()).padStart(2, '0');
    fetchDailyAttendance(formattedToday);
  }, []);

  useEffect(() => {
    const formattedDate = formatDate(selectedDate);
    fetchDailyAttendance(formattedDate);
  }, [selectedDate]);

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
      case 'off':
        return <MDBBadge color='secondary' pill>휴무</MDBBadge>;
      default:
        return <MDBBadge pill>미정</MDBBadge>;
    }
  };

  function formatDateTime(dateTimeStr) {

    if (!dateTimeStr) {
      // dateTimeStr 값이 null이거나 undefined일 경우 빈 문자열 반환
      return '';
    }

    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0');
  };

  return (
    <>
    <div className='mt-4 mb-2 float-end'>
        <MDBBtn onClick={() => changeDate(-1)}>←</MDBBtn>
        <span className='m-4'>{formatDate(selectedDate)}</span>
        <MDBBtn onClick={() => changeDate(1)}>→</MDBBtn>
      </div>
    <MDBTable align='middle'>
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
                <h5 className='mb-0'>{renderAttendanceState(attendance.state)}</h5>
            </td>
            <td>{formatDateTime(attendance.time)}</td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
    </>
  );
};

export default TodayAttendanceList;