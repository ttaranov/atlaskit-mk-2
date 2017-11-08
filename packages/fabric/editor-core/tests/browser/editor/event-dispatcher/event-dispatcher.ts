import { name } from '../../../../package.json';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { EventDispatcher, createDispatch } from '../../../../src/editor/event-dispatcher';
import { PluginKey } from 'prosemirror-state';

describe(name, () => {
  describe('Event Dispatcher', () => {
    let eventDispatcher;
    beforeEach(() => {
      eventDispatcher = new EventDispatcher();
    });

    describe('EventDispatcher', () => {
      describe('#on', () => {
        it('should add event listener', () => {
          eventDispatcher.on('event', () => {});
          expect(Object.keys(eventDispatcher.listeners).length).to.eq(1); expect(eventDispatcher.listeners['event'].length).to.eq(1);
        });
      });

      describe('#off', () => {
        it('should remove event listener', () => {
          const listener = () => {};
          eventDispatcher.on('event', listener);
          eventDispatcher.off('event', listener);
          expect(Object.keys(eventDispatcher.listeners).length).to.eq(1);
          expect(eventDispatcher.listeners['event'].length).to.eq(0);
        });
      });

      describe('#emit', () => {
        it('should call listener once with provided data', () => {
          const listener = sinon.stub();
          const data = { test: 1 };
          eventDispatcher.on('event', listener);
          eventDispatcher.emit('event', data);
          expect(listener.calledOnce).to.eq(true);
          expect(listener.calledWithExactly(data)).to.eq(true);
        });
      });
    });

    describe('#createDispatch', () => {
      it('should return a dispatch function', () => {
        expect(typeof createDispatch(eventDispatcher)).to.eq('function');
      });

      it('should call listener once with provided data', () => {
        const listener = sinon.stub();
        const data = { test: 1 };
        eventDispatcher.on('event', listener);
        const dispatch = createDispatch(eventDispatcher);
        dispatch('event', data);
        expect(listener.calledOnce).to.eq(true);
        expect(listener.calledWithExactly(data)).to.eq(true);
      });

      it('should call listener once with provided data when event is a plugin key', () => {
        const listener = sinon.stub();
        const data = { test: 1 };
        const pluginKey = new PluginKey('event');
        const dispatch = createDispatch(eventDispatcher);
        eventDispatcher.on((pluginKey as any).key, listener);
        dispatch(pluginKey, data);
        expect(listener.calledOnce).to.eq(true);
        expect(listener.calledWithExactly(data)).to.eq(true);
      });
    });
  });
});
