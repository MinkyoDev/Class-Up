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
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

const Calendar = () => {

    const events = [
        { title: 'Sample Event', date: new Date() },
        // more events...
      ]

      const { userInfo } = useUserContext();
    
    return (
        <>
        
        <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
                <div className="main-content">
                    <h1>일정 캘린더</h1>
                </div>
                <div>
                    <FullCalendar 
                    plugins={[dayGridPlugin]} 
                    initialView="dayGridMonth" 
                    events={events} /*events 배열은 달력에 표시될 이벤트 목록이다.*/
                    />
                </div>
            </div>
            
        </div>
        </>
    );
};

export default Calendar;