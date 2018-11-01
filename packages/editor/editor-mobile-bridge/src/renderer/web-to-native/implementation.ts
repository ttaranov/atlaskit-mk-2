import { sendToBridge } from '../utils';

class WebRendererBridge {
  call(...args) {
    sendToBridge.apply(null, args);
  }
}

export const toNativeBridge = new WebRendererBridge();
