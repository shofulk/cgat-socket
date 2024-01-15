import * as http from "http";
import { TMethods, TEndpoints } from './types';
export class Router {
  endpoints: TEndpoints;
  constructor() {
    this.endpoints = {};
  }

  request(
    method: TMethods,
    path: string,
    callback: (req: http.IncomingMessage, res: http.ServerResponse) => void,
  ) {
    if (!this.endpoints[path]) {
      this.endpoints[path] = {} as Record<
        TMethods,
        (req: http.IncomingMessage, res: http.ServerResponse) => void
      >;
    }

    const endpoint = this.endpoints[path];
    endpoint[method] = callback;
  }

  get(path: string, callback: (req: http.IncomingMessage, res: http.ServerResponse) => void) {
    this.request('GET', path, callback);
  }
  post(path: string, callback: (req: http.IncomingMessage, res: http.ServerResponse) => void) {
    this.request('POST', path, callback);
  }
  delete(path: string, callback: (req: http.IncomingMessage, res: http.ServerResponse) => void) {
    this.request('DELETE', path, callback);
  }
  put(path: string, callback: (req: http.IncomingMessage, res: http.ServerResponse) => void) {
    this.request('PUT', path, callback);
  }
}
