import { MentionBridge, TextFormattingBridge } from './bridge';
import AndroidBridge from './android-impl';
import IosBridge from './ios-impl';
import DummyBridge from './dummy-impl';
import NativeBridge from './bridge';

declare global {
  interface Window {
    mentionsBridge?: MentionBridge;
    textFormatBridge?: TextFormattingBridge;
    webkit?: any;
  }
}

function getBridgeImpl(): NativeBridge {
  if (window.mentionsBridge) {
    return new AndroidBridge();
  } else if (window.webkit) {
    return new IosBridge();
  } else {
    return new DummyBridge();
  }
}

export const toNativeBridge: NativeBridge = getBridgeImpl();
