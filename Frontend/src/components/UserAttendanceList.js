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
                <p className='fw-normal mb-1'>{userAttendance.time}</p>
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
