import React, { useState } from 'react';
import { createUser } from '../services/apiService';

const SignUp = () => {
  const [userData, setUserData] = useState({
    user_id: '',
    user_name: '',
    password1: '',
    password2: '',
    email: '',
    phone_number: ''
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(userData);
      // 회원가입 성공 후 추가 작업(예: 알림, 페이지 이동 등)
    } catch (error) {
      // 오류 처리
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>ID:</label>
        <input
          type="text"
          name="user_id"
          value={userData.user_id}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="user_name"
          value={userData.user_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password1"
          value={userData.password1}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          name="password2"
          value={userData.password2}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          name="phone_number"
          value={userData.phone_number}
          onChange={handleChange}
        />
      </div>
      <button type="submit">회원가입</button>
    </form>
  );
};

export default SignUp;