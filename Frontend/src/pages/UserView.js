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
import UserAttendanceList from '../components/UserAttendanceList'
import Navbar from '../components/Navbar';
import UserList from '../components/UserList';

const UserView = () => {

    const { userInfo } = useUserContext();
    
    return (
        <>
        <div className="home-container" style={{ display: 'flex', width: '100%' }}>
        <Navbar />
        <div className="content-container mt-5 ms-5" style={{ flexGrow: 1, margin: '5rem' }}>
                <div className="main-content">
                    <h1>우리들을 소개해요</h1>
                </div>
                <div>
                    <UserList/>
                </div>
            </div>
            
        </div>
        </>
    );
};

export default UserView;