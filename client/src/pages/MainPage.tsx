import { useContext, useMemo } from "react";
import { Row, Col, List, Dropdown, Button, Flex } from "antd";
import { AuthContext } from "../context/AuthContext";
import { UserChatList } from "../components/UserChatList";
import { UserChat } from "../components/UserChat";
import { MainContext, MainContextProvider } from "../context/MainContext";

function MainPage() {
  const { user } = useContext(AuthContext) ?? {};
  const {
    isChatsLoading,
    chats,
    potentialNewChats,
    createNewChat,
    selectedChat,
    selectChat,
    selectedChatName,
  } = useContext(MainContext) ?? {};

  const potentialNewChatsMenu = useMemo(() => {
    if (!potentialNewChats) {
      return { items: [] };
    }
    return {
      items: potentialNewChats.map(({ _id, name }) => ({
        key: _id,
        label: <span onClick={() => createNewChat?.(_id)}>{name}</span>,
      })),
    };
  }, [potentialNewChats]);

  if (!user) {
    return null;
  }

  if (isChatsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex vertical>
      <Row justify="space-between">
        {selectedChat ? (
          <>
            <Col span={4} className="user_chats">
              <Row>
                <Col span={4}>
                  <Dropdown menu={potentialNewChatsMenu}>
                    <Button>New chat</Button>
                  </Dropdown>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <List
                    itemLayout="horizontal"
                    dataSource={chats}
                    renderItem={(item) => (
                      <UserChatList
                        chat={item}
                        user={user}
                        selectChat={selectChat}
                      />
                    )}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={16}>
              <UserChat
                chat={selectedChat}
                user={user}
                chatName={selectedChatName}
              />
            </Col>
          </>
        ) : (
          <Col span={22} className="user_chats">
            <Row>
              <Col span={4}>
                <Dropdown menu={potentialNewChatsMenu}>
                  <Button>New chat</Button>
                </Dropdown>
              </Col>
            </Row>
            <Row>
              <Col span={22}>
                <List
                  itemLayout="horizontal"
                  dataSource={chats}
                  renderItem={(item) => (
                    <UserChatList
                      chat={item}
                      user={user}
                      selectChat={selectChat}
                    />
                  )}
                />
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </Flex>
  );
}

function Main() {
  return (
    <MainContextProvider>
      <MainPage />
    </MainContextProvider>
  );
}

export default Main;
