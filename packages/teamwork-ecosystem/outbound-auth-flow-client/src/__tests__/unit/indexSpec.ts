import { auth } from '../..';

// jsdom Window requires options
declare var Window: {
  new (options?: {}): Window;
};

let authWindow: Window;

describe('auth()', () => {
  beforeEach(() => {
    authWindow = new Window({});
    window.open = () => {
      return authWindow;
    };
  });

  it('should reject when the window is closed', () => {
    window.open = () => {
      const win = new Window({});
      Object.defineProperty(win, 'closed', { value: true });
      Object.defineProperty(win, 'close', { value: jest.fn() });
      return win;
    };

    const promise = auth('/');

    return expect(promise).rejects.toMatchObject({
      message: 'The auth window was closed',
    });
  });

  it('should reject when the message indiciates failure', () => {
    const promise = auth('/');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'outbound-auth:failure',
          message: 'Where was the earth shattering kaboom?',
        },
        source: authWindow,
      }),
    );

    return expect(promise).rejects.toMatchObject({
      message: 'Where was the earth shattering kaboom?',
    });
  });

  it('should not reject when the message indicates success and is from another window', done => {
    const promise = auth('/');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'outbound-auth:success',
        },
        source: new Window({}),
      }),
    );

    promise.then(() => done.fail(), () => done.fail());

    setTimeout(done, 500);
  });

  it('should not reject when the message indicates failure and is from another window', done => {
    const promise = auth('/');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'outbound-auth:failure',
          message: 'Uh oh.',
        },
        source: new Window({}),
      }),
    );

    promise.then(() => done.fail(), () => done.fail());

    setTimeout(done, 500);
  });

  it('should resolve when the message indicates success and it is from the same window', () => {
    const promise = auth('/');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'outbound-auth:success',
        },
        source: authWindow,
      }),
    );

    return expect(promise).resolves.toBeUndefined();
  });
});
