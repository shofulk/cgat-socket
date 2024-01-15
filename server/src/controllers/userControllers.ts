import * as jwt from "jsonwebtoken";
import * as validator from "validator";
import * as bcrypt from "bcrypt";
import { ServerResponse } from "http";
import { userModel } from "../models/userModel";
import { IncomingMessageWithBodyAndQueryPathParams } from "../helpers/types";

export class UserControllers {
  static async registerUser(
    req: IncomingMessageWithBodyAndQueryPathParams,
    res: ServerResponse,
  ) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "All fields are required." }));
        return;
      }

      let user = await userModel.findOne({ email });
      console.log(user);
      if (user) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Email should be unique!!!" }));
        return;
      }

      const newUser = new userModel({ name, email, password });
      const salt = await bcrypt.genSalt(10);

      newUser.password = (await bcrypt.hash(
        newUser.password,
        salt,
      )) as unknown as string;

      await newUser.save();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ID: newUser._id,
          name: newUser.name,
          email: newUser.email,
        }),
      );
      return;
    } catch (e) {
      console.error("Error during creating a new user: ", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Opps!" }));
      return;
    }
  }

  static async login(
    req: IncomingMessageWithBodyAndQueryPathParams,
    res: ServerResponse,
  ) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email });

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid password or login" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ID: user._id,
          name: user.name,
          email: user.email,
        }),
      );
      return;
    } catch (e) {
      console.error("Error during login: ", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Opps!" }));
      return;
    }
  }

  static async getUserDetails(
    req: IncomingMessageWithBodyAndQueryPathParams,
    res: ServerResponse,
  ) {
    try {
      const { email, ID } = req.queryParams;

      if (!email && !ID) {
        res.writeHead(400, { "Content-type": "application/json" });
        res.end(JSON.stringify({ message: "Email is required parameter!!!" }));
        return;
      }

      const user = await userModel.findOne({ $or: [{ email }, { _id: ID }] });

      if (!user) {
        res.writeHead(400, { "Content-type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid user!!!" }));
        return;
      }

      res.writeHead(200, { "Content-type": "application/json" });
      res.end(
        JSON.stringify({ ID: user._id, name: user.name, email: user.password }),
      );
      return;
    } catch (e) {
      console.log("Error during getting user details, ", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Opps!" }));
      return;
    }
  }

  static async getUsers(
    req: IncomingMessageWithBodyAndQueryPathParams,
    res: ServerResponse,
  ) {
    try {
      const users = await userModel.find({}, ["_id", "name", "email"]);
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify(users));
      return;
    } catch (e) {
      console.log("Error during getting user details, ", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Opps!" }));
      return;
    }
  }
}
