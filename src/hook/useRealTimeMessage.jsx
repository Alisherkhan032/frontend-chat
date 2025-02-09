import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, selectMessages, addMessage } from "../slices/chatSlice";
import { selectSelectedUser } from "../slices/chatSlice";
import { selectSocket } from "../slices/socketSlice";
import { selectAuthUser } from "../slices/authSlice";

const useRealTimeMessage = () => {
  const socket = useSelector(selectSocket);
  const selectedUser = useSelector(selectSelectedUser);
  const messages = useSelector(selectMessages);
  const authUser = useSelector(selectAuthUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (msg) => {
        // Check if message is either from or to the selected user
        const isMessageFromSelectedUser = selectedUser && msg.senderId === selectedUser._id;
        const isMessageToSelectedUser = selectedUser && msg.receiverId === selectedUser._id;
        
        // If you're the sender, msg.senderId will match your authUser._id
        // If you're the receiver, msg.receiverId will match your authUser._id
        const isMessageInvolvedWithCurrentUser = 
          msg.senderId === authUser._id || msg.receiverId === authUser._id;

        // Only add message if it's part of the current conversation
        if ((isMessageFromSelectedUser || isMessageToSelectedUser) && isMessageInvolvedWithCurrentUser) {
          dispatch(setMessages([...messages, msg]));
        }
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, dispatch, selectedUser, authUser]);
};

export default useRealTimeMessage;