import { messageModel } from "../models/messageModel";
import { ServerResponse } from "http";
import { IncomingMessageWithBodyAndQueryPathParams } from "../helpers/types";

export class MessageControllers {
  static async createMessage(
    req: IncomingMessageWithBodyAndQueryPathParams,
    res: ServerResponse,
  ) {
    try {
      const { chatID, memberID, message } = req.body;
      if (!chatID || !memberID || !message) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "All params are required" }));
        return;
      }

      const mes = new messageModel({ chatID, memberID, message });
      await mes.save();

      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ID: mes._id }));
      return;
    } catch (e) {
      console.error("Error during creating a new message: ", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Opps!" }));
      return;
    }
  }

  static async getMessages(
    req: IncomingMessageWithBodyAndQueryPathParams,
    res: ServerResponse,
  ) {
    try {
      const { chatID } = req.queryParams;
      if (!chatID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "ChatID is required parameters." }));
        return;
      }

      const messages = await messageModel.find({ chatID }, ['_id', 'charID', 'memberID', 'message', 'createdAt']).sort({ createdAt: 1 });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(messages));
      return;
    } catch (e) {
      console.error("Error during getting messages: ", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Opps!" }));
      return;
    }
  }
}
