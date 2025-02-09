import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthUser,
  setAuthUser,
  setOnlineUsers,
} from "../slices/authSlice";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(setAuthUser(null));
      dispatch(setOnlineUsers([]));
      toast.success("User logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <header
      className="bg-base-100 border-b  border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80 scrollbar-hide"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Vartalaap</h1>
            </Link>
            <div>
              Welcome <span className="font-bold">{user?.fullName}</span>
            </div>
          </div>

          <div></div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {user && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
