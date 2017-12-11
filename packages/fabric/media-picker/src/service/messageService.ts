import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

export interface Message<P> {
  readonly type: string;
  readonly payload: P;
}

export type MessagePayloadHandler<P, R> = (payload: P) => Promise<R>;

export interface MessageService {
  post<P, R>(message: Message<P>): Promise<R>;
  handle<P, R>(type: string, handler: MessagePayloadHandler<P, R>): void;
}
