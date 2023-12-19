import axios from 'axios';

const BASE_URL = 'http://221.163.19.218:7783';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// 회원가입 API
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/api/user/create', userData);
    return response.data;
  } catch (error) {
    // 오류 처리
    console.error('Create User Error:', error);
    throw error;
  }
};

// 로그인 API
export const loginUser = async (credentials) => {
  try {
    // FormData 객체 생성
    const formData = new FormData();

    // credentials 객체의 각 키와 값을 FormData에 추가
    for (const key in credentials) {
      formData.append(key, credentials[key]);
    }

    console.log(formData);

    // Axios 요청을 form 데이터와 함께 보냄
    const response = await axiosInstance.post('/api/user/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

// 회원 목록 조회 API
export const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get('/api/user/list');
    return response.data;
  } catch (error) {
    // 오류 처리
    console.error('Fetch Users Error:', error);
    throw error;
  }
};

// 출석 목록 조회 API
export const fetchAttendance = async () => {
  try {
    const response = await axiosInstance.get('/api/attendance/list');
    return response.data;
  } catch (error) {
    // 오류 처리
    console.error('Fetch Attendance Error:', error);
    throw error;
  }
};

export const checkAttendance = async () => {
  try {
    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null; // userInfo 구조에 맞게 수정

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    console.log("Authorization header: Bearer " + token);

    const response = await axiosInstance.get('/api/attendance/attendance', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Attendance Error:', error);
    throw error;
  }
};