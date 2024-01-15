import { useContext } from "react";
import { Skeleton, Flex, Typography, Card } from "antd";
import { ChatType, UserType } from "../utils/types";
import axios from "../utils/axios";
import { UserChatInput } from "./UserChatInput";
import { MainContext } from "../context/MainContext.tsx";

const { Text, Title } = Typography;

type UserChatBoxType = {
  chat: ChatType;
  user: UserType;
  chatName?: string;
};

export function UserChat({ chat, user, chatName }: UserChatBoxType) {
  const { socket, messages, isMessagesLoading, setMessages } =
    useContext(MainContext) ?? {};

  const handleCreateMessage = async (message: string, cb: () => void) => {
    if (!message) {
      return;
    }
    const newMessageObj = {
      chatID: chat._id,
      memberID: user.ID,
      message,
    };
    const { data } = await axios.post("/messages/create", newMessageObj);
    setMessages?.((prev) => {
      return [...prev, { ...newMessageObj, _id: data.ID }];
    });
    socket?.emit("CreateMessage", {
      ...newMessageObj,
      _id: data.ID,
      socketID: socket.id,
    });
    cb();
  };

  return (
    <Card
      className="card__user_chats_box"
      title={<Title level={4}>{chatName || "Chat"}</Title>}
      actions={[<UserChatInput handleCreateMessage={handleCreateMessage} />]}
    >
      <Skeleton loading={isMessagesLoading} className="list_container">
        <ul className="ul__list_messages">
          {messages!.map(({ _id, memberID, message }) => (
            <li key={_id}>
              <Flex justify={memberID === user.ID ? "flex-end" : "flex-start"}>
                <div
                  className={`ul__list_messages__item_context ${
                    memberID === user.ID
                      ? "item_context_right"
                      : "item_context_left"
                  }`}
                >
                  <Text>{message}</Text>
                </div>
              </Flex>
            </li>
          ))}
        </ul>
      </Skeleton>
    </Card>
  );
}
