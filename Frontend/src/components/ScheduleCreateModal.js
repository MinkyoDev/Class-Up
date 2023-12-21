import React, { useState } from 'react';
import { MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import { createSchedule } from '../services/apiService';

const ScheduleCreateModal = ({selectedDate, isOpen, onClose}) => {

  const [scheduleData, setScheduleData] = useState({
    title: '',
    content: '',
    start_datetime: selectedDate || '',
    end_datetime: ''
  });

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
                type='datetime-local'
                name='start_datetime'
                value={scheduleData.start_datetime}
                onChange={handleChange}
                label='시작 시간'
              />
              <MDBInput
                className='mb-4'
                type='datetime-local'
                name='end_datetime'
                value={scheduleData.end_datetime}
                onChange={handleChange}
                label='종료 시간'
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