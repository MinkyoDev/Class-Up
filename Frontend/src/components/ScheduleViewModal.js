import React, { useState, useEffect } from 'react';
import { MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import { updateSchedule, deleteSchedule } from '../services/apiService';

const ScheduleViewModal = ({ selectedEvent, isOpen, onClose }) => {
  if (!selectedEvent || !isOpen) return null;

  // 오늘 날짜보다 하루 뒤의 날짜를 계산하는 함수
  const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    id: selectedEvent.id,
    title: selectedEvent.title,
    content: selectedEvent.content, 
    start_date: selectedEvent.start,
    end_date: selectedEvent.end
  });

  // selectedEvent가 변경될 때마다 scheduleData를 업데이트
  useEffect(() => {
    if (selectedEvent) {
      setScheduleData({
        id: selectedEvent.id,
        title: selectedEvent.title,
        content: selectedEvent.content,
        start_date: selectedEvent.start,
        end_date: selectedEvent.end
      });
    }
  }, [selectedEvent]);

  const handleChange = (e) => {
    setScheduleData({ ...scheduleData, [e.target.name]: e.target.value });
  };

  // 수정 가능 여부를 판단하는 함수
  const canEdit = () => {
    const tomorrow = getTomorrowDate();
    return new Date(scheduleData.start_date) >= new Date(tomorrow);
  };

  const handleEdit = () => {
    if (canEdit()) {
      setIsEditMode(true);
    } else {
      alert('이미 지난 일정은 수정할 수 없습니다.');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSchedule(selectedEvent.id, scheduleData);
      onClose();
      alert('스케줄이 수정되었습니다.');
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('스케줄 수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('스케줄을 삭제하시겠습니까?')) {
      try {
        await deleteSchedule(selectedEvent.id);
        alert('스케줄이 삭제되었습니다.');
        window.location.reload(); // 페이지 새로고침
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('스케줄 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <MDBModal open={isOpen} staticBackdrop tabIndex='-1' >
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>일정 상세</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={onClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
          {isEditMode ? (
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
                  min={scheduleData.start_date}
                  max={scheduleData.end_date}
                />
                <MDBInput
                  className='mb-4'
                  type='date'
                  name='end_date'
                  value={scheduleData.end_date}
                  onChange={handleChange}
                  label='종료일'
                  min={scheduleData.start_date}
                />
                <MDBBtn type='submit' className='mb-4' block>수정 완료</MDBBtn>
              </form>
            ) : (
              <>
                <h3>{selectedEvent.title}</h3>
                <h5>{scheduleData.content}</h5>
                <h6>{selectedEvent.start.toLocaleString()} 부터 {selectedEvent.end.toLocaleString()} 까지</h6>
                <div className='d-grid gap-2 d-md-flex justify-content-md-end' style={{ marginLeft: 'auto' }}>
                  <MDBBtn color='danger' onClick={handleDelete}>삭제</MDBBtn>
                  <MDBBtn color='primary' onClick={handleEdit} disabled={!canEdit()}>수정</MDBBtn>
                </div>
              </>
            )}
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default ScheduleViewModal;