import { useEffect, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedUser,
  selectSelectedUser,
  selectUsers,
  setUsers,
} from "../slices/chatSlice";
import { selectOnlineUsers } from "../slices/authSlice";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const Sidebar = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const selectedUser = useSelector(selectSelectedUser);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const onlineUsers = useSelector(selectOnlineUsers);

  const getUsers = async () => {
    try {
      setIsUsersLoading(true);
      const res = await axiosInstance.get("/messages/users");
      dispatch(setUsers(res.data.users));
    } catch (error) {
      console.log("error in getUsers in sidebar component ", error);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    // If selected user goes offline and showOnlineOnly is true,
    // we should deselect them
    if (showOnlineOnly && !onlineUsers.includes(user._id)) {
      dispatch(setSelectedUser(null));
      return;
    }
    dispatch(setSelectedUser(user));
  };

  // Filter users based on online status
  const filteredUsers = showOnlineOnly 
    ? users.filter(user => onlineUsers.includes(user._id))
    : users;

  useEffect(() => {
    getUsers();
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  // Add effect to handle selected user when toggling online only mode
  useEffect(() => {
    if (showOnlineOnly && selectedUser && !onlineUsers.includes(selectedUser._id)) {
      dispatch(setSelectedUser(null));
    }
  }, [showOnlineOnly, selectedUser, onlineUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length > 0 ? onlineUsers.length - 1 : 0} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">
            {showOnlineOnly ? "No online users" : "No users found"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;