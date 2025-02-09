// export const BASE_URL = 'http://localhost:5001/api';
export const BASE_URL = 'https://vartalaap-2c2d.onrender.com/api';
// export const SOCKET_URL = 'http://localhost:5001';
export const SOCKET_URL = 'https://vartalaap-2c2d.onrender.com/';

export const DEFAULT_PROFILE_PICTURE = "https://plus.unsplash.com/premium_vector-1723276520843-4a7b1f939a95?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

export const formatMessageTime = (date)=> {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }