/* eslint-disable react/prop-types */
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import profile_pic from "../../assets/profile_pic.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

function UserChat({ user, chat }) {
  const { recipientUser } = useFetchRecipient(chat, user);
  const { onlineUsers, notification, markThisUserNotificationAsRead } =
    useContext(ChatContext);
  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  const unreadNotifications = unreadNotificationsFunc(notification);
  const thisUserNotifications = unreadNotifications?.filter(
    (n) => n.senderId == recipientUser?._id
  );

  const { latestMessage } = useFetchLatestMessage(chat);
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center justify-content-between p-2"
      role="button"
      onClick={() => {
        if (thisUserNotifications?.length > 0) {
          markThisUserNotificationAsRead(thisUserNotifications, notification);
        }
      }}
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={profile_pic} alt="Profile Pic" height={"40px"} />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">
            {latestMessage?.text.length > 25
              ? latestMessage?.text.substring(0, 25) + "..."
              : latestMessage?.text}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">
          {moment(latestMessage?.createdAt).calendar()}
        </div>
        {thisUserNotifications?.length > 0 ? (
          <div className="this-user-notifications">
            {thisUserNotifications?.length}
          </div>
        ) : null}
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
}

export default UserChat;
