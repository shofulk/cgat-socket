import * as http from "http";
import { EventEmitter } from "events";
import { Router } from "./router";
import Middlewares from "./middlewares";

export class Server extends EventEmitter {
  private readonly _baseUrl: string;
  private _server: http.Server;

  constructor(baseUrl: string) {
    super();
    this._baseUrl = baseUrl;
    this._server = this.createServer();
  }

  private createServer() {
    return http.createServer((req, res) => {
      Middlewares.parseBodyAndUrl(req, this._baseUrl, (error) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS",
        );
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Access-Control-Max-Age", 100);

        if (req.method === "OPTIONS") {
          res.writeHead(204).end();
          return;
        }

        if (error) {
          console.error(error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Bad Request" }));
          return;
        }

        const url = new URL(req.url, this._baseUrl);

        this.emit(this.getPath(url.pathname, req.method), req, res);
      });
    });
  }

  private getPath(url: string, method: string) {
    return `[${url}]:[${method}]`;
  }

  addRouter(router: Router) {
    for (const path in router.endpoints) {
      const endpoint = router.endpoints[path];
      for (const method in endpoint) {
        const cb = endpoint[method];
        this.on(this.getPath(path, method), (req, res) => {
          cb(req, res);
        });
      }
    }
  }

  listen() {
    this._server.listen(8000, () => {
      console.log("Running...");
    });
  }

  get server() {
    return this._server;
  }
}
