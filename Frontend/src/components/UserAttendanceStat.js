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
  <>
    <h4>
    {userInfo.user_name} 님은 <br/>
    출석 {attendanceStats.attendance_count} 회 / 
    지각 {attendanceStats.late_count} 회 / 
    결석 {attendanceStats.absent_count} 회 /
    휴무 {attendanceStats.off_count} 회 <br/>
    하셨군요!
    </h4>
    <h4>
    그래서 총 벌금은 {attendanceStats.total_fine} 원 을 내신답니다!
    </h4>
    {/* <MDBTable>
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
          <td>석{attendanceStats.attendance_count}</td>
          <td>{attendanceStats.late_count}</td>
          <td>{attendanceStats.absent_count}</td>
          <td>{attendanceStats.total_fine}</td>
        </tr>
      </MDBTableBody>
    </MDBTable> */}
    </>
  );
};

export default UserAttendanceStat;