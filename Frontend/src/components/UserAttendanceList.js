import React, { useEffect, useState } from 'react';
import { fetchUserAttendance } from '../services/apiService';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const UserAttendanceList = () => {
  const [userAttendanceList, setUserAttendanceList] = useState([]);

  useEffect(() => {
    const getUserAttendanceList = async () => {
      try {
        const data = await fetchUserAttendance();
        setUserAttendanceList(data);
      } catch (error) {
        // 오류 처리
      }
    };

    getUserAttendanceList();
  }, []);

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
    <>
    <MDBTable align='middle'>
      <MDBTableHead>
        <tr>
          <th scope='col'>출석 시간</th>
          <th scope='col'>출석 상태</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
          {userAttendanceList.map((userAttendance) => (
            <tr key={userAttendance.user_id}>
              <td>
                <p className='fw-normal mb-1'>{formatDateTime(userAttendance.time)}</p>
              </td>
              <td>
                {renderAttendanceState(userAttendance.state)}
              </td>
            </tr>
          ))}
        </MDBTableBody>
    </MDBTable>
    </>
  );
};

export default UserAttendanceList;
