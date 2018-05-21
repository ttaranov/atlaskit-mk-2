// @flow

let debugEnabled = true;
let stacktracesEnabled = false;

export function enableLogger(enable: boolean): void {
  debugEnabled = enable;
}

export function enableStacktraces(enable: boolean): void {
  stacktracesEnabled = enable;
}

export function logStacktrace(): void {
  if (stacktracesEnabled) {
    // tslint:disable-next-line:no-console
    console.log(new Error().stack);
  }
}

function debug(msg: any, ...args: any[]): void {
  if (debugEnabled) {
    // tslint:disable-next-line:no-console
    console.log(msg, ...args);
  }
}

export default {
  sendUIEvent: (event: any) => {
    debug('sendUIEvent: ', event);
  },
  sendOperationalEvent: (event: any) => {
    debug('sendOperationalEvent: ', event);
  },
  sendTrackEvent: (event: any) => {
    debug('sendTrackEvent: ', event);
  },
  sendScreenEvent: (event: any) => {
    debug('sendScreenEvent: ', event);
  },
};
