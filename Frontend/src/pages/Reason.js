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

const Reason = () => {
    
    return (
        <>
        
        <div className="home-container" style={{ display: 'flex' }}>
        <Navbar />
            <div className="content-container mt-5 ms-5" >
                <div className="main-content">
                    <h1>홈 화면</h1>
                </div>
                <div>
                </div>
            </div>
            
        </div>
        </>
    );
};

export default Reason;