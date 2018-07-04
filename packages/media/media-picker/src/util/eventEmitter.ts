import { EventEmitter2 } from 'eventemitter2';

export type EventPayloadMap<P = any> = {
  readonly [event: string]: P;
};

export type EventPayloadListener<
  M extends EventPayloadMap<P>,
  E extends keyof M,
  P = any
> = (payload: M[E]) => void;

export interface EventEmitter<M extends EventPayloadMap<P>, P = any> {
  once<E extends keyof M>(event: E, listener: EventPayloadListener<M, E>): void;
  on<E extends keyof M>(event: E, listener: EventPayloadListener<M, E>): void;
  onAny<E extends keyof M>(listener: (event: E, payload: M[E]) => void): void;
  addListener<E extends keyof M>(
    event: E,
    listener: EventPayloadListener<M, E>,
  ): void;
  off<E extends keyof M>(event: E, listener: EventPayloadListener<M, E>): void;
  removeListener<E extends keyof M>(
    event: E,
    handler: EventPayloadListener<M, E>,
  ): void;
  removeAllListeners<E extends keyof M>(event: E): void;
  emit<E extends keyof M>(event: E, payload: M[E]): boolean;
}

export class GenericEventEmitter<M extends EventPayloadMap<P>, P = any>
  implements EventEmitter<M> {
  private readonly emitter = new EventEmitter2({ wildcard: true });

  once<E extends keyof M>(
    event: E,
    listener: EventPayloadListener<M, E>,
  ): void {
    // @ts-ignore
    this.emitter.once(event, listener);
  }

  on<E extends keyof M>(event: E, listener: EventPayloadListener<M, E>): void {
    // @ts-ignore
    this.emitter.on(event, listener);
  }

  onAny<E extends keyof M>(listener: (event: E, payload: M[E]) => void): void {
    // @ts-ignore
    this.emitter.onAny(listener);
  }

  addListener<E extends keyof M>(
    event: E,
    listener: EventPayloadListener<M, E>,
  ): void {
    // @ts-ignore
    this.emitter.addListener(event, listener);
  }

  off<E extends keyof M>(event: E, listener: EventPayloadListener<M, E>): void {
    // @ts-ignore
    this.emitter.off(event, listener);
  }

  removeListener<E extends keyof M>(
    event: E,
    handler: EventPayloadListener<M, E>,
  ): void {
    // @ts-ignore
    this.emitter.removeListener(event, handler);
  }

  removeAllListeners<E extends keyof M>(event?: E | E[]): void {
    // We want to explicitly call removeAllListeners without any argument if event is undefined, otherwise will EventEmitter fail
    if (event === undefined) {
      this.emitter.removeAllListeners();
    } else {
      // @ts-ignore
      this.emitter.removeAllListeners(event);
    }
  }

  emit<E extends keyof M>(event: E, payload: M[E]): boolean {
    // @ts-ignore
    return this.emitter.emit(event, payload);
  }
}
