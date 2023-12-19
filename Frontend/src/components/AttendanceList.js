import React, { useEffect, useState } from 'react';
import { fetchAttendance } from '../services/apiService';

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const getAttendance = async () => {
      try {
        const data = await fetchAttendance();
        setAttendance(data);
      } catch (error) {
        // 오류 처리
      }
    };

    getAttendance();
  }, []);

  return (
    <div>
      <h1>출석 목록</h1>
      <ul>
        {attendance.map(record => (
          <li key={record.id}>{`${record.username} - ${record.time}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceList;
