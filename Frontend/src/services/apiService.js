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

    // Axios 요청을 form 데이터와 함께 보냄
    const response = await axiosInstance.post('/api/user/login_n', formData, {
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
    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null; // userInfo 구조에 맞게 수정

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.get('/api/user/user_list', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

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

// 사용자 출석 정보 조회 API
export const fetchUserAttendance = async () => {
  try {
    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.get(`/api/attendance/user_attendance/${userInfo.userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Fetch User Attendance Error:', error);
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

// 사용자 상태 정보 조회 API
export const fetchUserStatus = async () => {
  try {
    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.get(`/api/user/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Fetch User Status Error:', error);
    throw error;
  }
};

// 사용자 상태 정보 조회 API
export const getTodayUserAttendance = async () => {
  try {
    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.get(`/api/attendance/today_user_attendance/${userInfo.user_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Fetch User Status Error:', error);
    throw error;
  }
};

// 회원 정보 수정 API
export const updateUser = async (userId, updateData, currentPassword) => {
  try {
    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.put(`/api/user/update/${userId}?password=${currentPassword}`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Update User Error:', error);
    throw error;
  }
};

// 프로필 사진 변경 API
export const changeProfileImage = async (formData) => {
  const storedData = localStorage.getItem('userInfo');
  const userInfo = storedData ? JSON.parse(storedData) : null;
  const token = userInfo ? userInfo.access_token : null;

  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const response = await axiosInstance.post('/api/user/change_profile_image', formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

// 출석 통계 조회 API
export const getAttendanceStats = async (username) => {
  try {
    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.get(`/api/attendance/attendance_stats/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Fetch Attendance Stats Error:', error);
    throw error;
  }
};

