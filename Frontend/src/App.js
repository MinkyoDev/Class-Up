import React from 'react';
import { MDBBtn, MDBContainer } from 'mdb-react-ui-kit';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Attendance from './pages/Attendance';
import Calendar from './pages/Calendar';
import Assignment from './pages/Assignment';
import Penalty from './pages/Penalty';
import Project from './pages/Project';
import Approval from './pages/Approval';
import Study from './pages/Study';
import FreeBoard from './pages/FreeBoard';
import UserUpdate from './pages/UserUpdate';
import CreatePost from './pages/CreatePost';
import FreeBoardView from './pages/FreeBoardView';
import UserView from './pages/UserView';
import UpdatePost from './pages/UpdatePost';
import Admin from './pages/Admin';
import UserList from './components/UserList';
import AttendanceList from './components/AttendanceList';
import PrivateRoute from './components/PrivateRoute';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <MDBContainer fluid>
      <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
          <Route path="/penalty" element={<PrivateRoute><Penalty /></PrivateRoute>} />
          <Route path="/approval" element={<PrivateRoute><Approval /></PrivateRoute>} />
          <Route path="/study" element={<PrivateRoute><Study /></PrivateRoute>} />
          <Route path="/assignment" element={<PrivateRoute><Assignment /></PrivateRoute>} />
          <Route path="/project" element={<PrivateRoute><Project /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
          <Route path="/userupdate" element={<PrivateRoute><UserUpdate /></PrivateRoute>} />
          <Route path="/freeboard" element={<PrivateRoute><FreeBoard /></PrivateRoute>} />
          <Route path="/createpost" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
          <Route path="/updatepost/:postId" element={<PrivateRoute><UpdatePost /></PrivateRoute>} />
          <Route path="/freeboard/:postId" element={<PrivateRoute><FreeBoardView /></PrivateRoute>} />
          <Route path="/userlist" element={<PrivateRoute><UserView /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        </Routes>
      </Router>
    </UserProvider>
    </MDBContainer>
  );
}

export default App;
