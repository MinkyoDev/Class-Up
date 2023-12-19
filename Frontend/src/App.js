import React from 'react';
import { MDBBtn, MDBContainer } from 'mdb-react-ui-kit';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/users" element={<PrivateRoute><UserList /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><AttendanceList /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        </Routes>
      </Router>
    </UserProvider>
    </MDBContainer>
  );
}

export default App;
