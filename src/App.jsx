import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Outlet,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser, setAuthUser, setOnlineUsers } from "./slices/authSlice";
import { setSocket, selectSocket } from "./slices/socketSlice";
import { selectTheme } from "./slices/themeSlice";
import { axiosInstance } from "./lib/axios";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { SOCKET_URL } from "./lib/utils";
import { io } from "socket.io-client";

const Auth = () => {
  const authUser = useSelector(selectAuthUser);
  const location = useLocation();

  return authUser ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

const App = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const theme = useSelector(selectTheme);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/auth/check-auth");
      dispatch(setAuthUser(res.data));
    } catch (error) {
      dispatch(setAuthUser(null));
      console.log("error in checkAuth", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(()=>{
    let socket;
    if(authUser){
      socket = io(SOCKET_URL, {
        query : {
          userId : authUser._id
        }
      })
      dispatch(setSocket(socket))
      
      socket.on("getOnlineUsers", (onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      });

    } else {
      if(socket){
        socket.disconnect();
        dispatch(setSocket(null));
        socket=null;
      }
    }
    
    return ()=>{
      if(socket){
        socket.disconnect();
        dispatch(setSocket(null));
        socket=null;
      }
    }

  }, [authUser])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/signup"
            element={authUser ? <HomePage /> : <SignupPage />}
          />
          <Route path="/login" element={authUser ? <HomePage /> : <LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route element={<Auth />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>

        <Toaster position="top-center" reverseOrder={false} />
      </Router>
    </div>
  );
};

export default App;
