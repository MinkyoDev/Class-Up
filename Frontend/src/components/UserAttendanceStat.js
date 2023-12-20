import React, { useEffect, useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { getAttendanceStats } from '../services/apiService';
import { useUserContext } from '../contexts/UserContext';

const UserAttendanceStat = () => {
  const { userInfo } = useUserContext();
  const [attendanceStats, setAttendanceStats] = useState({});

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        const stats = await getAttendanceStats(userInfo.user_name);
        setAttendanceStats(stats);
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
      }
    };

    fetchAttendanceStats();
  }, [userInfo.user_name]);

  return (
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th>출석</th>
          <th>지각</th>
          <th>결석</th>
          <th>총 벌금</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td>{attendanceStats.attendance_count}</td>
          <td>{attendanceStats.late_count}</td>
          <td>{attendanceStats.absent_count}</td>
          <td>{attendanceStats.total_fine}</td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
};

export default UserAttendanceStat;