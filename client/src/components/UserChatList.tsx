import { List, Skeleton } from "antd";
import useFetchRecipientUser from "../hooks/useFetchRecipientUser";
import {ChatType, UserType} from "../utils/types.ts";

type UserChatsProps = {
  chat: ChatType,
  user: UserType,
  selectChat?: (chat: ChatType, chatName: string) => void
};

export function UserChatList({ chat, user, selectChat }: UserChatsProps) {
  const { recipientUser, isRecipientUserLoading } =
    useFetchRecipientUser({ chat, user }) ?? {};

  const parseDateFormat = (timestamp: string) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const handleClick = () => {
    selectChat?.(chat, recipientUser!.name);
  }

  return (
    <List.Item onClick={handleClick}>
      <Skeleton loading={isRecipientUserLoading} title={false} active>
        <List.Item.Meta title={recipientUser?.name} description="Bla bla bla" />
        <div>{parseDateFormat(chat.createdAt)}</div>
      </Skeleton>
    </List.Item>
  );
}
