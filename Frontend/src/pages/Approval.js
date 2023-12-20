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
import AttendanceList from '../components/AttendanceList';

const Approval = () => {

    const { userInfo } = useUserContext();
    
    return (
        <>
        
        <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
                <div className="main-content">
                    <h1>사유 게시판</h1>
                </div>
                <div>
                </div>
            </div>
            
        </div>
        </>
    );
};

export default Approval;