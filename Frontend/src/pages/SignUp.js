import React, { useState } from 'react';
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { createUser } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [userData, setUserData] = useState({
    user_id: '',
    user_name: '',
    password1: '',
    password2: '',
    email: '',
    phone_number: ''
  });

  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(userData);
      // 회원가입 성공 후 추가 작업(예: 알림, 페이지 이동 등)
      alert('회원 가입이 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      // 오류 처리
      alert('회원 가입에 실패했습니다.');
    }
  };

  return (
<>
<div className="container mt-5">
<h1>회원가입</h1>
<form onSubmit={handleSubmit}>
      <MDBInput className='mb-4' type='text' name="user_id"
          value={userData.user_id}
          onChange={handleChange} label='ID' />
      <MDBInput className='mb-4' type='text' name="user_name"
          value={userData.user_name}
          onChange={handleChange} label='Name' />
      <MDBInput className='mb-4' type='password' name="password1"
          value={userData.password1}
          onChange={handleChange} label='Password' />
      <MDBInput className='mb-4' type='password' name="password2"
          value={userData.password2}
          onChange={handleChange} label='Confirm Password' />
      <MDBInput className='mb-4' type='email' name="email"
          value={userData.email}
          onChange={handleChange} label='E-Mail' />
      <MDBInput className='mb-4' type='text' name="phone_number"
          value={userData.phone_number}
          onChange={handleChange} label='Phone Number' />
{/* 
      <MDBCheckbox
        wrapperClass='d-flex justify-content-center mb-4'
        id='form3Example5'
        label='Subscribe to our newsletter'
        defaultChecked
      /> */}

      <MDBBtn type='submit' className='mb-4' block>
        회원가입
      </MDBBtn>

    </form>
    </div>
    </>
  );
};

export default SignUp;