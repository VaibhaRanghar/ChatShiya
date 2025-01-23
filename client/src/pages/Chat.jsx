import { Container, Stack } from "react-bootstrap";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";
import SideBar from "../components/SideBar";

function Chat() {
  return (
    <Container>
      <PotentialChats />
      <Stack
        direction="horizontal"
        gap={5}
        className="align-items-start"
      >
        <SideBar />
        <ChatBox />
      </Stack>
    </Container>
  );
}

export default Chat;
