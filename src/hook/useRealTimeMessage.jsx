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
    if (!socket) return;

    socket.on("newMessage", (msg) => {
      dispatch(addMessage(msg));
    });

    return () => socket.off("newMessage");
  }, [socket, dispatch]);
};

export default useRealTimeMessage;