import { ServerResponse } from "http";
import { chatModel } from "../models/chatModel";
import { userModel } from "../models/userModel";
import { IncomingMessageWithBodyAndQueryPathParams } from "../helpers/types";

export class ChatControllers {
  static async createChat(
    req: IncomingMessageWithBodyAndQueryPathParams,
    res: ServerResponse,
  ) {
    try {
      const { firstMember, secondMember } = req.body;

      if (!firstMember || !secondMember) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "You can not create a chat with only one member",
          }),
        );
        return;
      }

      const chat = await chatModel.findOne({
        members: { $all: [firstMember, secondMember] },
      });
      console.log(chat);
      if (chat) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(chat));
        return;
      }

      const newChat = new chatModel({ members: [firstMember, secondMember] });
      await newChat.save();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(chat));
      return;
    } catch (e) {
      console.error("Error during creating a new user: ", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Opps!" }));
      return;
    }
  }

  static async findUserChats(
    req: IncomingMessageWithBodyAndQueryPathParams,
    res: ServerResponse,
  ) {
    try {
      const { member } = req.queryParams;
      if (!member) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Member can not be null!" }));
        return;
      }

      const chats = await chatModel.find({ members: { $in: [member] } }, [
        "_id",
        "members",
        "createdAt",
      ]);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(chats));
      return;
    } catch (e) {
      console.error("Error during creating a new user: ", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Opps!" }));
      return;
    }
  }

  static async findChat(
    req: IncomingMessageWithBodyAndQueryPathParams,
    res: ServerResponse,
  ) {
    try {
      const { firstMembers, secondMembers } = req.queryParams;
      if (!firstMembers || !secondMembers) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Members can not be null!" }));
        return;
      }

      const chats = await chatModel.findOne({
        members: { $all: [firstMembers, secondMembers] },
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(chats));
      return;
    } catch (e) {
      console.error("Error during creating a new user: ", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Opps!" }));
      return;
    }
  }

  static async getPotentialUsersForNewChat(
    req: IncomingMessageWithBodyAndQueryPathParams,
    res: ServerResponse,
  ) {
    try {
      const { userID } = req.queryParams;
      const chats = await chatModel.find({ members: { $in: [userID] } }, [
        "members",
      ]);

      const secondMembers: { members: string[] }[] = chats.map((chat) =>
        chat.members.find((ID) => ID !== userID),
      );

      const potentialUsers = await userModel.find(
        { _id: { $nin:  [...secondMembers, userID] } },
        ["_id", "name"],
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(potentialUsers));
      return;
    } catch (e) {
      console.error("Error during getting potential chats: ", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Opps!" }));
      return;
    }
  }
}
