import React, { useEffect, useRef, useState } from "react";
import {
  selectMessages,
  selectSelectedUser,
  setMessages,
} from "../slices/chatSlice";
import { selectAuthUser } from "../slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector(selectSelectedUser);
  const authUser = useSelector(selectAuthUser);
  const messages = useSelector(selectMessages);
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef(null);

  const getMessages = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/messages/${id}`);
      dispatch(setMessages(res.data));
    } catch (error) {
      console.log("error in getMessages in ChatContainer component ", error);
      toast.error("Failed to get messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // useEffect(() => {
  //   if (messageEndRef.current && messages) {
  //     messageEndRef.current.scrollIntoView({
  //       behavior: "smooth",
  //     });
  //   }
  // }, [messages]);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [messages]);
  

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages &&
          messages.length > 0 &&
          messages.map((message, idx) => (
            <div
              key={message._id || idx}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
              ref={messageEndRef}
            >
              <div className=" chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
