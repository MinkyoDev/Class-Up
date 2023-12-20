import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../services/apiService';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const serverURL = 'http://221.163.19.218:7783/'; // 서버 URL

const UserList = () => {
  const [users, setUsers] = useState([]);

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
        {users.map((users) => (
          <tr key={users.user_id}>
            <td>
                <img
                  src={users.profile_image ? serverURL + users.profile_image : users.profile_image}
                  alt={users.user_name}
                  style={{ width: '45px', height: '45px' }}
                  className='rounded-circle'
                />
            </td>
            <td>
              <div className='d-flex align-items-center'>
                <div className='ms-0'>
                  <p className='fw-bold mb-1'>{users.user_name}</p>
                  <p className='text-muted mb-0'>{users.user_id}</p>
                </div>
              </div>
            </td>
            <td>
            <MDBBadge color={users.state ? 'success' : 'warning'} pill>
                  {users.state ? '출근' : '자택'}
                </MDBBadge>
            </td>
            <td>
            <p className='fw-normal mb-1'>{users.email}</p>
            </td>
            <td>
              {users.phone_number.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
    </>
  );
};

export default UserList;
