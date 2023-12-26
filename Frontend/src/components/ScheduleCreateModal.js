import React, { useState, useEffect } from 'react';
import { MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import { createSchedule } from '../services/apiService';

const ScheduleCreateModal = ({selectedDate, isOpen, onClose}) => {

  const [scheduleData, setScheduleData] = useState({
    title: '',
    content: '',
    start_date: selectedDate || '', // null 대신 빈 문자열 사용
    end_date: ''
  });

  const [endDate, setEndDate] = useState('');

  // 종료 날짜 변경 시 endDate 상태를 업데이트
  useEffect(() => {
    if (scheduleData.end_date) {
      setEndDate(scheduleData.end_date);
    }
  }, [scheduleData.end_date]);

  // selectedDate가 변경될 때마다 scheduleData 상태를 업데이트합니다.
  useEffect(() => {
    setScheduleData(prev => ({
      ...prev,
      start_date: selectedDate || '', // null 대신 빈 문자열 사용
      end_date: prev.end_date || selectedDate || '' // 종료 날짜가 없으면 시작 날짜를 기본값으로 설정
    }));
  }, [selectedDate]);

  const handleChange = (e) => {
    setScheduleData({ ...scheduleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSchedule(scheduleData);
      onClose();
      alert('스케줄이 등록되었습니다.');
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('스케줄 등록에 실패했습니다.');
    }
  };

  // 조건부 렌더링을 사용하여 모달을 표시
  if (!isOpen) return null;

  return (
    <MDBModal open={isOpen} staticBackdrop tabIndex='-1' >
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>스케줄 생성</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={onClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <form onSubmit={handleSubmit}>
              <MDBInput className='mb-4' type='text' name='title' value={scheduleData.title} onChange={handleChange} label='제목' />
              <MDBInput className='mb-4' type='text' name='content' value={scheduleData.content} onChange={handleChange} label='내용' />
              <MDBInput
                className='mb-4'
                type='date'
                name='start_date'
                value={scheduleData.start_date}
                onChange={handleChange}
                label='시작일'
                max={endDate} // 종료 날짜를 최대 선택 가능 날짜로 설정
              />
              <MDBInput
                className='mb-4'
                type='date'
                name='end_date'
                value={scheduleData.end_date}
                onChange={handleChange}
                label='종료일'
                min={scheduleData.start_date} // 시작 날짜를 min 값으로 설정
              />
              <MDBBtn type='submit' className='mb-4' block>스케줄 등록</MDBBtn>
            </form>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default ScheduleCreateModal;