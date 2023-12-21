import React, { useState } from 'react';
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/apiService';
import { useUserContext } from '../contexts/UserContext';

const Login = () => {

    const navigate = useNavigate();
    const { setUserInfo } = useUserContext();
    const [credentials, setCredentials] = useState({
        user_id: '',
        password: ''
    });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(credentials);

      // userStatus 추가
      const userStatus = response.userStatus; // API 응답에 따라 조정 필요

      localStorage.setItem('userInfo', JSON.stringify(response)); // 토큰 저장
      setUserInfo(response);
      navigate('/');
    } catch (error) {
        console.log("에러 : " + error);
        alert('로그인에 실패했습니다.');
      // 오류 처리
    }
  };

  const handleSignUp = () => {
    navigate('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <div className="container mt-5">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit} >
      <MDBInput className='mb-4' type='text' name='user_id' 
      value={credentials.user_id}
      onChange={handleChange}
      label='ID' />
      <MDBInput className='mb-4' type='password' name='password' 
      value={credentials.password}
      onChange={handleChange}
      label='Password' />

      <MDBRow className='mb-4'>
        <MDBCol className='d-flex justify-content-center'>
          <MDBCheckbox id='form2Example3' label='ID 기억하기' defaultChecked />
        </MDBCol>
      </MDBRow>

      <MDBBtn type='submit' className='mb-3' block>
        로그인
      </MDBBtn>

      <div className='text-center'>
        <p>
          <MDBBtn type="button" onClick={handleSignUp} className="mb-1" block>회원가입</MDBBtn>
        </p>
        {/* <p>or sign up with:</p>

        <MDBBtn floating color="secondary" className='mx-1'>
          <MDBIcon fab icon='facebook-f' />
        </MDBBtn>

        <MDBBtn floating color="secondary" className='mx-1'>
          <MDBIcon fab icon='google' />
        </MDBBtn>

        <MDBBtn floating color="secondary" className='mx-1'>
          <MDBIcon fab icon='twitter' />
        </MDBBtn>

        <MDBBtn floating color="secondary" className='mx-1'>
          <MDBIcon fab icon='github' />
        </MDBBtn> */}
      </div>
    </form>
      
    </div>
  );
};

export default Login;