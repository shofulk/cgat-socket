import * as http from "http";

export type TMethods = "GET" | "POST" | "DELETE" | "PUT";

export interface IncomingMessageWithBodyAndQueryPathParams extends http.IncomingMessage {
  body?: any;
  queryParams?: {
    [key: string]: any,
  }
}

export type TEndpointMiddleware = (req: IncomingMessageWithBodyAndQueryPathParams, res: http.ServerResponse) => void | Promise<void>

export type TEndpoints = Record<
  string,
  Record<string, TEndpointMiddleware>
>;