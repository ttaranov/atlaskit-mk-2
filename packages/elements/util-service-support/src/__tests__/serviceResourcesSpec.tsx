import { expect } from 'chai';
import * as sinon from 'sinon';

import { AbstractResource } from '../serviceResources';
import { OnProviderChange } from '../types';

class TestResource extends AbstractResource<
  string,
  string[],
  string,
  string,
  {}
> {
  filter() {}

  callNotifyResult(result: string[]) {
    this.notifyResult(result);
  }

  callNotifyError(error: string) {
    this.notifyError(error);
  }

  callNotifyInfo(info: string) {
    this.notifyInfo(info);
  }

  callNotifyNotReady() {
    this.notifyNotReady();
  }
}

class TestOnProviderChange
  implements OnProviderChange<string[], string, string> {
  result = sinon.stub();
  error = sinon.stub();
  info = sinon.stub();
  notReady = sinon.stub();
}

class MinimalTestOnProviderChange
  implements OnProviderChange<string[], string, string> {
  result = sinon.stub();
}

const result = ['a', 'b'];
const errMsg = 'error';
const infoMsg = 'info';

const testSubscriptions = (subCount: number) => {
  let resource: TestResource;
  let listeners: TestOnProviderChange[];

  beforeEach(() => {
    resource = new TestResource();
    listeners = [];
    for (let i = 0; i < subCount; i++) {
      const listener = new TestOnProviderChange();
      listeners.push(listener);
      resource.subscribe(listener);
    }
  });

  it('all listeners called on notifyResult', () => {
    resource.callNotifyResult(result);
    listeners.forEach(listener => {
      expect(listener.result.calledWith(result), 'result(...)').to.equal(true);
      expect(listener.result.calledOnce, 'result').to.equal(true);
      expect(listener.error.calledOnce, 'error').to.equal(false);
      expect(listener.info.calledOnce, 'info').to.equal(false);
      expect(listener.notReady.calledOnce, 'notReady').to.equal(false);
    });
  });

  it('new subscriber gets notified of last result', () => {
    resource.callNotifyResult(result);
    const listener = new TestOnProviderChange();
    resource.subscribe(listener);
    resource.callNotifyResult(result);
    expect(listener.result.calledWith(result), 'result(...)').to.equal(true);
    expect(listener.result.calledOnce, 'result').to.equal(true);
  });

  it('all listeners called on notifyError', () => {
    resource.callNotifyError(errMsg);
    listeners.forEach(listener => {
      expect(listener.error.calledWith(errMsg), 'error(...)').to.equal(true);
      expect(listener.result.calledOnce, 'result').to.equal(false);
      expect(listener.error.calledOnce, 'error').to.equal(true);
      expect(listener.info.calledOnce, 'info').to.equal(false);
      expect(listener.notReady.calledOnce, 'notReady').to.equal(false);
    });
  });

  it('all listeners called on notifyInfo', () => {
    resource.callNotifyInfo(infoMsg);
    listeners.forEach(listener => {
      expect(listener.info.calledWith(infoMsg), 'error(...)').to.equal(true);
      expect(listener.result.calledOnce, 'result').to.equal(false);
      expect(listener.error.calledOnce, 'error').to.equal(false);
      expect(listener.info.calledOnce, 'info').to.equal(true);
      expect(listener.notReady.calledOnce, 'notReady').to.equal(false);
    });
  });

  it('all listeners called on notifyNotReady', () => {
    resource.callNotifyNotReady();
    listeners.forEach(listener => {
      expect(listener.result.calledOnce, 'result').to.equal(false);
      expect(listener.error.calledOnce, 'error').to.equal(false);
      expect(listener.info.calledOnce, 'info').to.equal(false);
      expect(listener.notReady.calledOnce, 'notReady').to.equal(true);
    });
  });

  it('optional callbacks are skipped', () => {
    const minimalListener = new MinimalTestOnProviderChange();
    resource.subscribe(minimalListener);
    resource.callNotifyResult(result);
    resource.callNotifyError(errMsg);
    resource.callNotifyInfo(infoMsg);
    resource.callNotifyNotReady();
    listeners.forEach(listener => {
      expect(listener.result.calledOnce, 'result').to.equal(true);
      expect(listener.error.calledOnce, 'error').to.equal(true);
      expect(listener.info.calledOnce, 'info').to.equal(true);
      expect(listener.notReady.calledOnce, 'notReady').to.equal(true);
    });
    expect(minimalListener.result.calledWith(result), 'result(...)').to.equal(
      true,
    );
    expect(minimalListener.result.calledOnce, 'result').to.equal(true);
  });

  if (subCount > 0) {
    it('unsubscribed listeners are not called on notifyResult', () => {
      const removedListener = listeners[0];
      resource.unsubscribe(removedListener);
      resource.callNotifyResult(result);
      expect(removedListener.result.calledOnce, 'result').to.equal(false);
    });

    it('unsubscribed listeners are not called on notifyResult', () => {
      const removedListener = listeners[0];
      resource.unsubscribe(removedListener);
      resource.callNotifyError(errMsg);
      expect(removedListener.error.calledOnce, 'error').to.equal(false);
    });

    it('unsubscribed listeners are not called on notifyResult', () => {
      const removedListener = listeners[0];
      resource.unsubscribe(removedListener);
      resource.callNotifyInfo(infoMsg);
      expect(removedListener.info.calledOnce, 'info').to.equal(false);
    });

    it('unsubscribed listeners are not called on notifyResult', () => {
      const removedListener = listeners[0];
      resource.unsubscribe(removedListener);
      resource.callNotifyNotReady();
      expect(removedListener.notReady.calledOnce, 'notReady').to.equal(false);
    });
  }
};

describe('AbstractResource', () => {
  describe('no subscribers', () => {
    testSubscriptions(0);
  });

  describe('one subscribers', () => {
    testSubscriptions(1);
  });

  describe('two subscribers', () => {
    testSubscriptions(2);
  });
});
