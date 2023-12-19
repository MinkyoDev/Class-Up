import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const savedUserInfo = localStorage.getItem('userInfo');
        return savedUserInfo ? JSON.parse(savedUserInfo) : null;
      });

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
