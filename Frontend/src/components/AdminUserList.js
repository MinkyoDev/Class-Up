import React, { useEffect, useState } from 'react';
import { fetchUsers, adminCheckAttendance, updateEmploymentStatus, updateAttendanceType } from '../services/apiService';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const serverURL = 'http://221.163.19.218:7783/'; // 서버 URL

const AdminUserList = () => {
  const [users, setUsers] = useState([]);

  const handleImageClick = (imageUrl) => {
    // 새 창에서 이미지를 팝업 형태로 보여주기
    window.open(imageUrl, 'Image', 'width=800,height=600'); 
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getUsers();
  }, []);

    // 사용자 상태에 따른 레이블과 색상을 반환하는 함수
    const getStatusLabelAndColor = (user) => {
      if (user.employment) {
        return { label: '취직', color: 'success' };
      } else if (!user.state) {
        return { label: '휴가', color: 'secondary' };
      } else if (!user.attendance_type) {
        return { label: '재택', color: 'info' };
      } else {
        return { label: '출근', color: 'primary' };
      }
    };

  const handleAttendance = async (userId) => {
    try {
      await adminCheckAttendance(userId);
      alert('출석 처리가 완료되었습니다.');
      // 출석 처리 후 사용자 목록을 다시 불러올 수 있습니다.
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error during attendance check:', error);
      alert(error.response.data.detail);
    }
  };

  // 사용자의 취직 상태를 업데이트하는 함수
  const handleEmploymentUpdate = async (userId, employmentStatus) => {
    try {
      await updateEmploymentStatus(userId, employmentStatus);
      alert(employmentStatus ? '취직 처리가 완료되었습니다.' : '퇴직 처리가 완료되었습니다.');
      // 상태 변경 후 사용자 목록을 다시 불러옴
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error updating employment status:', error);
      alert(error.response.data.detail);
    }
  };

  // 사용자의 재택 근무 상태를 업데이트하는 함수
  const handleAttendanceTypeUpdate = async (userId, newAttendanceType) => {
    try {
      await updateAttendanceType(userId, newAttendanceType);
      alert('재택 근무 상태가 업데이트 되었습니다.');
      // 업데이트 후 사용자 목록을 다시 불러옴
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error updating attendance type:', error);
      alert(error.response.data.detail);
    }
  };

  return (
    <>
    <MDBTable align='middle'>
      <MDBTableHead>
        <tr>
          <th scope='col'>프로필</th>
          <th scope='col'>이름</th>
          <th scope='col'>상태</th>
          <th scope='col'>출석</th>
          <th scope='col'>재택 여부</th>
          <th scope='col'>취업 여부</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
      {users.map((user) => {
          const { label, color } = getStatusLabelAndColor(user);
          const employmentButtonLabel = user.employment ? '퇴직' : '취직';
          const newEmploymentStatus = !user.employment;
          return (
          <tr key={user.user_id}>
            <td>
            <img
                src={user.profile_image ? serverURL + user.profile_image : user.profile_image}
                alt={user.user_name}
                style={{ width: '65px', height: '65px' }}
                className='rounded-circle'
                onClick={() => handleImageClick(serverURL + user.profile_image)} // 개별 이미지 클릭 이벤트
              />
            </td>
            <td>
              <div className='d-flex align-items-center'>
                <div className='ms-0'>
                  <p className='fw-bold mb-1'>{user.user_name}</p>
                  <p className='text-muted mb-0'>{user.user_id}</p>
                </div>
              </div>
            </td>
            <td>
              <h5 className='mb-0'><MDBBadge color={color} pill>{label}</MDBBadge></h5>
            </td>
            <td>
            <MDBBtn 
                type='button' 
                className='mb-0' 
                color='success' 
                block
                onClick={() => handleAttendance(user.user_id)}>출석
            </MDBBtn>
            </td>
            <td>
              <MDBBtn 
                type='button' 
                className='mb-0'
                color={user.attendance_type ? 'secondary' : 'info'} 
                block
                onClick={() => handleAttendanceTypeUpdate(user.user_id, !user.attendance_type)}
              >
                {user.attendance_type ? '재택' : '출근'}
              </MDBBtn>
            </td>
            <td>
              <MDBBtn
                type='button'
                className='mb-0'
                color={user.employment ? 'warning' : 'secondary'}
                block
                onClick={() => handleEmploymentUpdate(user.user_id, newEmploymentStatus)}
              >
                {employmentButtonLabel}
              </MDBBtn>
            </td>
          </tr>
        );
      })}
      </MDBTableBody>
    </MDBTable>
    </>
  );
};

export default AdminUserList;
