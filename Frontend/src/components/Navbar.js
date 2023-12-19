import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>CLASSUP</h1>
      <hr />
      <ul className="nav-links">
        <li><Link to="/">홈</Link></li>
        <li><Link to="/reason">사유신청</Link></li>
        <li><Link to="/calendar">캘린더</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;