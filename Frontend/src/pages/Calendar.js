import React, { useState, useEffect } from 'react';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
  } from 'mdb-react-ui-kit';
  import { useUserContext } from '../contexts/UserContext';
  import Navbar from '../components/Navbar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { fetchAllSchedules } from '../services/apiService';
import ScheduleCreateModal from '../components/ScheduleCreateModal'; // 모달 컴포넌트를 불러옵니다.
import ScheduleViewModal from '../components/ScheduleViewModal';

const Calendar = () => {

    const plugin = [
        dayGridPlugin, // 월간 달력 // day 그리드
        interactionPlugin
        /* 이벤트를 위한 플러그인
        일정 추가/수정 : 캘린더에 새 이벤트를 추가하거나 기존 이벤트를 수정 
          : 이벤트를 클릭하면 이벤트 정보를 수정하는 팝업이나 모달 띄움
        드래그 앤 드롭 : 마우스로 드래그하여 다른 날짜나 시간으로 이동
        리사이징 : 기간을 변경하여 이벤트의 기간을 늘이거나 줄임
        일정 클릭 이벤트
        */
      ];

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const { userInfo } = useUserContext();

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const getSchedules = async () => {
          try {
            const schedules = await fetchAllSchedules();
            const formattedEvents = schedules.map(schedule => ({
              title: `${schedule.user_name} - ${schedule.title}`,
              content: schedule.content,
              id: schedule.schedule_id,
              start: schedule.start_date,
              end: addOneDay(schedule.end_date) // 종료 날짜에 하루 추가
            }));
            setEvents(formattedEvents);
          } catch (error) {
            console.error('Error fetching schedules:', error);
          }
        };
    
        getSchedules();
      }, []);

    // 날짜 문자열에 하루를 추가하는 함수
    const addOneDay = (dateStr) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + 1); // 하루 추가
        return date.toISOString().split('T')[0]; // 날짜만 추출
    };

    // 날짜 선택 핸들러
    const handleDateClick = (arg) => {
        const dateStr = arg.dateStr; // 날짜 형식: "YYYY-MM-DD"
        setSelectedDate(dateStr);
        setModalOpen(true);
    };

    // 이벤트 클릭 핸들러
    const handleEventClick = (clickInfo) => {
        console.log(clickInfo.event.id);
        setSelectedEvent({
        ...clickInfo.event,
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        content: clickInfo.event.extendedProps.content,
        start: addOneDay(formatDateStr(clickInfo.event.start)),
        end: formatDateStr(clickInfo.event.end)
        });
        setViewModalOpen(true);
    };

    // 날짜를 "YYYY-MM-DD" 형식으로 포맷팅하는 함수
  const formatDateStr = (date) => {
    return date.toISOString().split('T')[0]; // 날짜만 추출
  };

  return (
    <>
    <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
          <div className="main-content">
            <h1>일정 캘린더</h1>
          </div>
          <div className="calendar-container">
          <FullCalendar
      // height={} // 높이 지정
      plugins={plugin}
      initialView="dayGridMonth" // 초기뷰 dayGridMonth or timeGridWeek
      headerToolbar={{ // 띄어쓰면 갭이 생기고, 콤마가 있으면 그룹으로 묶는 형태
        left: "title",
        // center: "today prev,next",
        // right: "dayGridMonth"
      }}
      footerToolbar={{
        // left: "prev",
        // center: "",
        // right: "next"
      }}
      /* 
          headerToolbar {
            title : text containing the current month/week/day 
            현재 월 / 일 / 년 의 텍스트
            prev : button for moving the calendar back one month/week/day
            이전 버튼
            next : button for moving the calendar forward one month/week/day
            다음 버튼
            prevYear : button for moving the calendar back on year
            이전 년도
            nextYear : button for moving the calendar forward one year
            다음 년도
            today : button for moving the calendar to the current month/week/day
            오늘로 이동
          }
          footerToolbar : headerToolbar와 동일한 옵션
        */
      //

      // titleFormat={{ year: "numeric", month: "short", day: "numeric" }}
      // eventDisplay=""

      // eventBackgroundColor="yellow" // 이벤트 배경색 미지정시 디폴트값으로 활용 가능
      // eventBorderColor="yellow" // 이벤트 보더색 미지정시 디폴트값으로 활용 가능
      // eventColor="blue" // eventBackgroundColor & eventBorderColor 두 값이 같을 때 // 우선순위 낮음
      //
      // navLinks={true} // 확인 안됨
      // navLinkDayClick={} // 확인 안됨
      // navLinkWeekClick={} // 확인 안됨
      // navLinkHint={} // 확인 안됨

      buttonText={{
        // prev: "이전", // 부트스트랩 아이콘으로 변경 가능
        // next: "다음",
        // prevYear: "이전 년도",
        // nextYear: "다음 년도",
        today: "오늘",
        month: "월별",
        week: "주별",
        day: "일별",
        list: "리스트"
      }}
      /* 버튼 텍스트 default {{
          prev: "<",
          next: ">",
          prevYear: "<<",
          nextYear: ">>",
          today: "today",
          month: "month",
          week: "week",
          day: "day",
        }} */
	  // event = 일정
      events={events} // 달력에 표시 될 이벤트
      dateClick={handleDateClick}
      eventClick={handleEventClick}  // 이벤트 클릭시
    //   eventChange={eventChange} // 이벤트 drop 혹은 resize 될 때
      editable={false} // 사용자의 수정 가능 여부 (이벤트 추가/수정, 드래그 앤 드롭 활성화)
      selectable={true} // 사용자의 날짜 선택 여부
      selectMirror={true} // 사용자의 시간 선택시 time 표시 여부
    //   select={select} // 날짜가 선택 될 때
      weekends={true} // 주말 표시 여부
      dayMaxEvents={true} // 하루에 표시 될 최대 이벤트 수 true = 셀의 높이
      navLinks={false} // 달력의 날짜 클릭시 일간 스케쥴로 이동
      navLinkHint={"클릭시 해당 날짜로 이동합니다."} // 날짜에 호버시 힌트 문구
      // eventContent={fn(): node {} || true} // 일정 커스텀
      eventsSet={function () {
      }} // 
      eventAdd={function () {
      }} // 추가시 로직
      eventDrop={function () {
      }} // 드롭시 로직
      eventRemove={function () {
      }} // 제거시 로직
    />
          </div>
          <ScheduleCreateModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            selectedDate={selectedDate}
          />
          <ScheduleViewModal
            selectedEvent={selectedEvent}
            isOpen={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
        />
        </div>
      </div>
    </>
  );
};

export default Calendar;