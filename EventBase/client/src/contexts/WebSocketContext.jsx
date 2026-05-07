import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect to WebSocket server
      const ws = new WebSocket(`ws://localhost:5000/ws?token=${user.token}`);
      
      ws.onopen = () => {
        console.log('WebSocket Connected');
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        
        const notification = JSON.parse(event.data);
        if (notification.type === 'NEW_EVENT') {
          const handleClick = () => {
            window.location.href = `/events/${notification.data.id}`;
          };
          
          toast.success(
            <div onClick={handleClick} style={{ cursor: 'pointer' }}>
              <div style={{ fontWeight: 'bold' }}>New Event: {notification.data.title}</div>
              <div style={{ fontSize: '0.8em', opacity: 0.8 }}>
                {new Date(notification.data.startDate).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.8em' }}>Click to view</div>
            </div>,
            {
              duration: 10000,
              position: 'bottom-right',
              style: { cursor: 'pointer' },
              onClick: handleClick
            }
          );
        }
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setSocket(null);
        // Attempt to reconnect after 5 seconds
        setTimeout(() => setSocket(new WebSocket(`ws://localhost:5000/ws?token=${user.token}`)), 5000);
      };

      return () => {
        ws.close();
      };
    }
  }, [user]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
