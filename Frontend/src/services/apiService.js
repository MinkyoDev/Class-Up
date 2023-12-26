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

// 모든 스케줄 조회 API
export const fetchAllSchedules = async () => {
  try {
    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.get(`/api/schedules/read_all_schedules/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Fetch All Schedules Error:', error);
    throw error;
  }
};

// 스케줄 생성 API
export const createSchedule = async (scheduleData) => {
  try {
    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.post('/api/schedules/create_schedule', scheduleData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Create Schedule Error:', error);
    throw error;
  }
};

// 스케줄 수정 API
export const updateSchedule = async (scheduleId, scheduleData) => {
  try {

    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.put(`/api/schedules/schedules/${scheduleId}`, scheduleData, {
      headers: {
        'Authorization': `Bearer ${token}`, // 여기서 yourAuthToken은 인증 토큰입니다.
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update Schedule Error:', error);
    throw error;
  }
};

// 스케줄 삭제 API
export const deleteSchedule = async (scheduleId) => {
  try {

    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    await axiosInstance.delete(`/api/schedules/schedules/${scheduleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Delete Schedule Error:', error);
    throw error;
  }
};

// 게시글 작성 API
export const createFreeboardPost = async (postData) => {
  try {

    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.post('/api/freeboard/create_freeboard', postData, {
      headers: {
        'Authorization': `Bearer ${token}`, // 여기서 yourAuthToken은 인증 토큰입니다.
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Create Freeboard Post Error:', error);
    throw error;
  }
};

// 전체 게시글 조회 API
export const fetchAllFreeboardPosts = async () => {
  try {

    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.get('/api/freeboard/read_freeboard/all', {
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Fetch All Freeboard Posts Error:', error);
    throw error;
  }
};

// 단일 게시글 조회 API
export const fetchFreeboardPost = async (postId) => {
  try {

    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.get(`/api/freeboard/read_freeboard/${postId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Fetch Freeboard Post Error:', error);
    throw error;
  }
};

// 벌금 랭킹 조회 API
export const getFineRanking = async () => {
  try {

    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.get('/api/attendance/fine_ranking', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Get Fine Ranking Error:', error);
    throw error;
  }
};

// 해당 날짜의 모든 유저의 출석 상태 조회 API
export const getDailyAttendance = async (date) => {
  try {

    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.get(`/api/attendance/daily_attendance?attendance_date=${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching daily attendance:', error);
    throw error;
  }
};

// 댓글 조회 함수
export const fetchComments = async (postId) => {
  try {
    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.get(`/api/fb_comments/read_comment/${postId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// 댓글 추가 함수
export const addComment = async (commentData) => {
  try {
    const storedData = localStorage.getItem('userInfo');
    const userInfo = storedData ? JSON.parse(storedData) : null;
    const token = userInfo ? userInfo.access_token : null;

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await axiosInstance.post('/api/fb_comments/create_comment', commentData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};