import { createContext, useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import { useAuthContext } from "./authContextProvider.jsx";

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  // https://linkup-z5pz.onrender.com
  // http://localhost:8000

  useEffect(() => {
    if (authUser) {
      const socketInstance = io("https://linkup-z5pz.onrender.com", {
        query: { userId: authUser._id },
      });

      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socketInstance.on("connect");

      socketInstance.on("disconnect", () => {
        setOnlineUsers([]);
      });

      return () => {
        socketInstance.off("getOnlineUsers");
        socketInstance.off("connect");
        socketInstance.off("disconnect");
        socketInstance.close();
      };
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
