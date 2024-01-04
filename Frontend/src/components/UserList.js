import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../services/apiService';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const serverURL = 'http://221.163.19.218:7783/'; // 서버 URL

const UserList = () => {
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
      return { label: '자택', color: 'info' };
    } else {
      return { label: '출근', color: 'primary' };
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
        </tr>
      </MDBTableHead>
      <MDBTableBody>
      {users.map((user) => {
          const { label, color } = getStatusLabelAndColor(user);
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
              <h5><MDBBadge color={color} pill>{label}</MDBBadge></h5>
            </td>
            <td>
              <p className='fw-normal mb-1'>{user.email}</p>
            </td>
            <td>
              {user.phone_number.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}
            </td>
          </tr>
        );
      })}
      </MDBTableBody>
    </MDBTable>
    </>
  );
};

export default UserList;
