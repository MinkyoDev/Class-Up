import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../services/apiService';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        // 오류 처리
      }
    };

    getUsers();
  }, []);

  return (
    <>
    <MDBTable align='middle'>
      <MDBTableHead>
        <tr>
          <th scope='col'>Name</th>
          <th scope='col'>Title</th>
          <th scope='col'>Status</th>
          <th scope='col'>Position</th>
          <th scope='col'>Actions</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <div className='d-flex align-items-center'>
                {/* 이미지 URL이 있다면 아래와 같이 사용할 수 있습니다. */}
                {/* <img
                  src={user.imageURL}
                  alt={user.username}
                  style={{ width: '45px', height: '45px' }}
                  className='rounded-circle'
                /> */}
                <div className='ms-3'>
                  <p className='fw-bold mb-1'>{user.username}</p>
                  <p className='text-muted mb-0'>{user.email}</p>
                </div>
              </div>
            </td>
            <td>
              <p className='fw-normal mb-1'>{user.id}</p>
            </td>
            <td>
              <MDBBadge color='success' pill>
                {user.email}
              </MDBBadge>
            </td>
            <td>{user.phone}</td>
            <td>
              <MDBBtn color='link' rounded size='sm'>
                Edit
              </MDBBtn>
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
    </>
  );
};

export default UserList;
