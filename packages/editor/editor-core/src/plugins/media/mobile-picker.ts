import { UploadParams } from '@atlaskit/media-picker';

export interface Listeners {
  [name: string]: Listener[];
}
export type Listener = (data: any) => void;

export default class MobilePicker {
  private listeners: Listeners = {};

  on(event: string, cb: Listener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(cb);
  }

  removeAllListeners(event: any) {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event] = [];
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

  setUploadParams(uploadParams: UploadParams) {}
}
