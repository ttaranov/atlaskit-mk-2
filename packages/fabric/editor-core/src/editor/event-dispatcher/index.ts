import { PluginKey } from 'prosemirror-state';

export interface Listeners { [name: string]: Listener[]; }
export type Listener = (data: any) => void;
export type Dispatch = (eventName: PluginKey | string, data: any) => void;

export class EventDispatcher {
  private listeners: Listeners = {};

  on(event: string, cb: Listener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(cb);
  }

  off(event: string, cb: Listener): void {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event] = this.listeners[event].filter(callback => callback !== cb);
  }

  emit(event: string, data: any): void {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event].forEach(cb => cb(data));
  }

  destroy(): void {
    this.listeners = {};
  }
}

/**
 * Creates a dispatch function that can be called inside ProseMirror Plugin
 * to notify listeners about that plugin's state change.
 */
export function createDispatch(eventDispatcher: EventDispatcher): Dispatch {
  return (eventName: PluginKey | string, data: any) => {
    if (!eventName) {
      throw new Error('event name is required!');
    }

    const event = typeof eventName === 'string' ? eventName : (eventName as any).key;
    eventDispatcher.emit(event, data);
  };
}
