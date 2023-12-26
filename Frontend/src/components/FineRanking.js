import React, { useEffect, useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { getFineRanking } from '../services/apiService';

const FineRanking = () => {
  const [fineRanking, setFineRanking] = useState([]);

  useEffect(() => {
    const fetchFineRanking = async () => {
      try {
        const rankingData = await getFineRanking();
        setFineRanking(rankingData);
      } catch (error) {
        console.error('Error fetching fine ranking:', error);
      }
    };

    fetchFineRanking();
  }, []);

  // 순위 이미지 매핑
  const rankImages = {
    1: '/images/rank_1.png', // 1위 이미지 경로
    2: '/images/rank_2.png', // 2위 이미지 경로
    3: '/images/rank_3.png', // 3위 이미지 경로
  };

  return (
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th>순위</th>
          <th>사용자 ID</th>
          <th>출석 횟수</th>
          <th>지각 횟수</th>
          <th>결석 횟수</th>
          <th>총 벌금</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {fineRanking.map((item, index) => (
          <tr key={index}>
            <td>
              {index < 3 ? (
                <img src={rankImages[index + 1]} alt={`Rank ${index + 1}`} style={{ height: '40px' }} />
              ) : (
                index + 1
              )}
            </td>
            <td style={{ verticalAlign: 'middle' }}>{item.user_id}</td>
            <td style={{ verticalAlign: 'middle' }}>{item.attendance_count}</td>
            <td style={{ verticalAlign: 'middle' }}>{item.late_count}</td>
            <td style={{ verticalAlign: 'middle' }}>{item.absent_count}</td>
            <td style={{ verticalAlign: 'middle' }}>{item.total_fine}</td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
};

export default FineRanking;