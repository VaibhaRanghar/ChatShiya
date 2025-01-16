import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

function PotentialChats() {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
  return (
    <>
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((u, index) => {
            if (u._id == user._id) return;
            return (
              <div
                key={index}
                className="single-user"
                onClick={() => {
                  createChat(user._id, u._id);
                }}
              >
                {u.name}{" "}
                <span
                  className={
                    onlineUsers?.some((users) => users?.userId === u._id)
                      ? "user-online"
                      : ""
                  }
                ></span>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default PotentialChats;
