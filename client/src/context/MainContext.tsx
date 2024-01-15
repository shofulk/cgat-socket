import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { ChatType, MessageType } from "../utils/types.ts";
import axios from "../utils/axios.ts";
import { AuthContext } from "./AuthContext.tsx";

type PotentialNewChat = { _id: string; name: string };

type MainContextType = {
  chats: ChatType[];
  isChatsLoading: boolean;
  socket?: Socket;
  potentialNewChats: PotentialNewChat[];
  createNewChat: (secondUserID: string) => void;
  selectedChat?: ChatType;
  selectChat: (chat: ChatType, chatName: string) => void;
  selectedChatName?: string;
  chatsError?: string;
  messages?: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  isMessagesLoading: boolean;
};

type MainContextProviderProps = {
  children: ReactNode;
};

export const MainContext = createContext<MainContextType | undefined>(
  undefined,
);

export const MainContextProvider: React.FC<MainContextProviderProps> = ({
  children,
}) => {
  const { user } = useContext(AuthContext) ?? {};
  const [chats, setChats] = useState<ChatType[]>([]);
  const [chatsError, setChatsError] = useState<string>();
  const [isChatsLoading, setIsChatsLoading] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket>();
  const [potentialNewChats, setPotentialNewChats] = useState<
    PotentialNewChat[]
  >([]);
  const [selectedChat, setSelectedChat] = useState<ChatType>();
  const [selectedChatName, setSelectedChatName] = useState<string>();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(true);

  useEffect(() => {
    const wss = io("ws://localhost:8000");

    setSocket(wss);

    return () => {
      wss?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      socket?.on("GetMessage", (message) => {
        if (selectedChat._id === message.chatID) {
          setMessages((prev) => [...prev, message]);
        }
      });

      setIsMessagesLoading(true);
      axios
        .get("/messages/", { params: { chatID: selectedChat._id } })
        .then((response) => {
          setMessages(response.data);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => setIsMessagesLoading(false));
    }
    return () => {
      socket?.off('GetMessage');
    }
  }, [selectedChat, user]);

  useEffect(() => {
    if (user) {
      axios
        .get("/chat/all", { params: { member: user.ID } })
        .then(({ data }) => {
          setChats(data);
        })
        .catch((e) => {
          setChatsError(e?.response?.data);
        })
        .finally(() => {
          setIsChatsLoading(false);
        });
      axios
        .get("chat/potential", { params: { userID: user.ID } })
        .then(({ data }) => {
          setPotentialNewChats(data);
        });
    }
  }, [user]);

  useEffect(() => {
    if (user && socket) {
      socket.emit("AddOnlineUser", user.ID);
    }

  }, [user, socket]);

  const createNewChat = useCallback(
    async (secondUserID: string) => {
      if (user && secondUserID) {
        const response = await axios.post("chat/create", {
          firstMember: user.ID,
          secondMember: secondUserID,
        });
        setPotentialNewChats((prev) => {
          return prev.filter(({ _id }) => _id !== secondUserID);
        });
        setChats((prev) => [
          ...prev,
          {
            _id: response.data._id,
            members: response.data.members,
            createdAt: response.data.createdAt,
          },
        ]);
      }
    },
    [user],
  );

  const selectChat = (chat: ChatType, chatName: string) => {
    setSelectedChat(chat);
    setSelectedChatName(chatName);
  };

  return (
    <MainContext.Provider
      value={{
        chats,
        socket,
        isChatsLoading,
        potentialNewChats,
        createNewChat,
        selectedChat,
        selectChat,
        selectedChatName,
        chatsError,
        messages,
        setMessages,
        isMessagesLoading,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
