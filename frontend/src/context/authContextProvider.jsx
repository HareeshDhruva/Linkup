import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (authUser) {
        localStorage.setItem("user", JSON.stringify(authUser));
      } else {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error(error);
    }
  }, [authUser]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
