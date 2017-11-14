import {
  GenericUploadEvents,
  ModuleConfig,
  ComponentConfigs
} from 'mediapicker';
import { PickerType } from '../../../../src/plugins/media/picker-facade';

export default class MockMediaPicker {
  public pickerType: PickerType;
  public moduleConfig: ModuleConfig;
  public componentConfig?: ComponentConfigs;
  public activated = false;
  public shown = false;
  public torndown = false;
  public deactivated = false;
  public cancelled = false;
  public listeners: { [eventName: string]: Array<(...args: any[]) => any> } = {};
  public uploaded?: [string, string];

  on(eventName: string, cb: (...args: any[]) => any) {
    const { listeners } = this;

    if (!listeners[eventName]) {
      listeners[eventName] = [];
    }

    listeners[eventName].push(cb);
  }

  activate() {
    this.activated = true;
  }

  show() {
    this.shown = true;
  }

  upload(url: string, fileName: string): void {
    this.uploaded = [url, fileName];
  }

  cancel(mediaId: string) {
    this.cancelled = true;
  }

  teardown: any = () => {
    this.torndown = true;
  }

  deactivate = () => {
    this.deactivated = true;
  }

  removeAllListeners() {
    this.listeners = {};
  }

  __triggerEvent<K extends keyof GenericUploadEvents>(eventName: K, event: GenericUploadEvents[K]) {
    const { listeners } = this;

    if (!listeners[eventName]) {
      return;
    }

    listeners[eventName].forEach((cb) => {
      cb.call(cb, event);
    });
  }
}
