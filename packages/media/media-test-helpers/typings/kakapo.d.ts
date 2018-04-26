declare module 'kakapo' {
  export type RouterOptions = {
    readonly host: string;
    readonly requestDelay: number;
  };

  export type Request = {};

  export class Response {
    constructor(code: number, body: any, headers: Headers);
  }

  export type RequestHandler = (request: Request) => Response;

  export class Router {
    constructor(options?: RouterOptions);
    get(url: string, handler: RequestHandler): void;
  }

  export class Server {
    use(router: Router): void;
  }
}
