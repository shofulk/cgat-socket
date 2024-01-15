import { IncomingMessageWithBodyAndQueryPathParams } from './types';

export default class Middlewares {
  static parseBodyAndUrl (req: IncomingMessageWithBodyAndQueryPathParams, baseUrl: string, next: (error?: Error) => void): void {
    let body = '';
    req.on('data', (chunk) => {
      if (chunk) {
        body += chunk.toString();
      }
    });

    req.on('end', () => {
      try {
        if (body) {
          req.body = JSON.parse(body);
        }

        const url = new URL(req.url, baseUrl);
        const queryParams = {};

        url.searchParams.forEach((value, name) => {
          queryParams[name] = value;
        });

        req.queryParams = queryParams;

        next();
      } catch (e) {
        next(e);
      }
    });
  }
}