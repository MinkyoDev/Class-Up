import React, { useEffect, useState } from 'react';
import { fetchUsers, adminCheckAttendance } from '../services/apiService';
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

  return (
    <>
    <MDBTable align='middle'>
      <MDBTableHead>
        <tr>
          <th scope='col'>프로필</th>
          <th scope='col'>이름</th>
          <th scope='col'>상태</th>
          <th scope='col'>이메일</th>
          <th scope='col'>전화번호</th>
          <th scope='col'>출석</th>
          <th scope='col'>재택 여부</th>
          <th scope='col'>취업 여부</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {users.map((user) => (
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
            <MDBBadge color={user.state ? 'success' : 'warning'} pill>
                  {user.state ? '출근' : '자택'}
                </MDBBadge>
            </td>
            <td>
            <p className='fw-normal mb-1'>{user.email}</p>
            </td>
            <td>
              {user.phone_number.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}
            </td>
            <td>
            <MDBBtn 
                type='button' 
                className='mb-4' 
                color='success' 
                block
                onClick={() => handleAttendance(user.user_id)}>출석
            </MDBBtn>
            </td>
            <td>
            <MDBBtn type='submit' className='mb-4' color='info' block>재택</MDBBtn>
            </td>
            <td>
            <MDBBtn type='submit' className='mb-4' color='secondary' block>취직</MDBBtn>
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
    </>
  );
};

export default AdminUserList;
