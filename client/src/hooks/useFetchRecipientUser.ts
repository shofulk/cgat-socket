import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { ChatType, UserType } from "../utils/types";

type UseFetchRecipientUserProps = {
  user: UserType;
  chat: ChatType;
};
type UseFetchRecipientUser = (props: UseFetchRecipientUserProps) => {
  recipientUser: UserType | null;
  isRecipientUserLoading: boolean;
};

const useFetchRecipientUser: UseFetchRecipientUser = ({ user, chat }) => {
  const [recipientUser, setRecipientUser] = useState<UserType | null>(null);
  const [isRecipientUserLoading, setIsRecipientUserLoading] =
    useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const secondRecipientUser = chat.members.find(
      (member) => member !== user?.ID,
    );
    if (!secondRecipientUser) {
      return;
    }
    setIsRecipientUserLoading(true);
    axios
      .get("/users/details", {
        params: { ID: secondRecipientUser },
        signal: controller.signal,
      })
      .then(({ data }) => {
        setRecipientUser(data);
        setIsRecipientUserLoading(false);
      })
      .catch();

    return () => {
      controller.abort();
    };
  }, []);

  return { recipientUser, isRecipientUserLoading };
};

export default useFetchRecipientUser;
