export type UserType = {
  ID: string;
  name: string;
  email: string;
};

export type ChatType = {
  _id: string;
  members: string[],
  createdAt: string;
};

export type MessageType = {
  _id: string,
  memberID: string;
  chatID: string;
  message: string;
};