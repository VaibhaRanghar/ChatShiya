import { useState } from "react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

function SideBar() {
  const [show, setShow] = useState(false);
  const { user } = useContext(AuthContext);
  const { userChats, updateCurrentChat, isUserChatsLoading } =
    useContext(ChatContext);

  return (
    <>
      <div className="sideBar">
        <div className={`side ${show ? "open" : "closed"}`}>
          <h5>Chats</h5>
          {userChats?.length < 1 ? null : (
            <Stack className="message-box flex-grow-0 pe-3" gap={3}>
              {isUserChatsLoading && <p>Loading chats...</p>}
              {userChats?.map((chat, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      updateCurrentChat(chat);
                    }}
                  >
                    <UserChat chat={chat} user={user} />
                  </div>
                );
              })}
            </Stack>
          )}
        </div>

        <div
          className={`container ${show ? "" : "shifted"}`}
          onClick={() => setShow(!show)}
        >
          <div className="lines"></div>
          <div className="lines"></div>
          <div className="lines"></div>
        </div>
      </div>

      <div className="over">
        {userChats?.length < 1 ? null : (
          <Stack className="message-box flex-grow-0 pe-3" gap={3}>
            {isUserChatsLoading && <p>Loading chats...</p>}
            {userChats?.map((chat, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    updateCurrentChat(chat);
                  }}
                >
                  <UserChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
        )}
      </div>
    </>
  );
}

export default SideBar;
