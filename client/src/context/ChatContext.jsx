/* eslint-disable react/prop-types */
import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

const ChatContext = createContext();

const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);

  const [notification, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState(null);

  //SOCKET CONNECTION
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);
  //ADD NEW USER.
  useEffect(() => {
    if (socket == null) return;
    socket.emit("addNewUser", user?._id);

    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, user]);

  //SEND MESSAGE.
  useEffect(() => {
    if (socket == null) return;
    const recipientId = currentChat?.members.find((id) => id !== user?._id);
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  //RECEIVE MESSAGE.
  useEffect(() => {
    if (socket == null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id != res.chatId) {
        return;
      }
      setMessages((prev) => [...prev, res]);
    });
    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  //GET ALL USERS
  useEffect(() => {
    const getUser = async () => {
      const response = await getRequest(`${baseUrl}users`);
      if (response.error) return console.log("Error fetching users", response);

      const pChats = response.filter((u) => {
        let isChatCreated = false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] == u._id || chat.members[1] == u._id;
          });
        }
        return !isChatCreated;
      });
      setPotentialChats(pChats);
      setAllUsers(response);
    };
    getUser();
  }, [userChats]);

  //GET ALL CHATS OF A USER.
  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setUserChatsError(null);
        setIsUserChatsLoading(true);

        const response = await getRequest(`${baseUrl}chats/${user?._id}`);

        setIsUserChatsLoading(false);
        if (response.error) {
          console.log("API ERROR", response);
          return setUserChatsError(response);
        }
        setUserChats(response);
      }
    };
    getUserChats();
  }, [user, notification]);

  //GET ALL MESSAGES OF A CHAT.
  useEffect(() => {
    const getMessages = async () => {
      setMessagesError(null);
      setIsMessagesLoading(true);

      const response = await getRequest(
        `${baseUrl}messages/${currentChat?._id}`
      );

      setIsUserChatsLoading(false);
      if (response.error) {
        return setUserChatsError(response);
      }
      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  //SEND MESSAGE.
  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessages) => {
      if (!textMessage) return console.log("Enter some text first");

      const response = await postRequest(
        `${baseUrl}messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );
      if (response.error) return setSendTextMessageError(response);
      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessages("");
    },
    []
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  //CREATE CHAT.
  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}chats`,
      JSON.stringify({ firstId, secondId })
    );
    if (response.error) {
      return console.log("Error creating chat ", response);
    }
    setUserChats((prev) => [...prev, response]);
  }, []);

  
  const markAllNotificationsAsRead = useCallback((notification) => {
    const mNotifications = notification.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notification) => {
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });
        return isDesiredChat;
      });
      // mark notification as read
      const mNotifications = notification.map((el) => {
        if (el.senderId === n.senderId) {
          return { ...el, isRead: true };
        } else {
          return el;
        }
      });

      setCurrentChat(desiredChat);
      setNotifications(mNotifications);
    },
    []
  );
  const markThisUserNotificationAsRead = useCallback(
    (thisUserNotifications, notification) => {
      const mNotifications = notification.map((el) => {
        let notificationn; // using double nn in spelling because above there is a state called notification.
        thisUserNotifications.forEach((n) => {
          if (el.senderId === n.senderId) {
            notificationn = { ...el, isRead: true };
          } else {
            notificationn = el;
          }
        });
        return notificationn;
      });
      setNotifications(mNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        userChatsError,
        isUserChatsLoading,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        messagesError,
        isMessagesLoading,
        currentChat,
        sendTextMessage,
        sendTextMessageError,
        onlineUsers,
        notification,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatContextProvider };
