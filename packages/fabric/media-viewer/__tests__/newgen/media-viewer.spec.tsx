import * as React from 'react';
import {
  update,
  effects,
  Model,
  Message,
  Component,
} from '../../src/newgen/media-viewer';
import { mount } from 'enzyme';
import { Stubs } from '../_stubs';
import { Subject } from 'rxjs/Subject';
import { MediaItemType, MediaItem } from '@atlaskit/media-core';
import Spinner from '@atlaskit/spinner';

describe('MediaViewer', () => {
  const token = 'some-token';
  const clientId = 'some-client-id';
  const serviceHost = 'some-service-host';
  const authProvider = jest.fn(() => Promise.resolve({ token, clientId }));
  const contextConfig = {
    serviceHost,
    authProvider,
  };

  describe('update', () => {
    it('once loaded the name is saved as unkown', () => {
      const initialModel: Model = {
        state: 'LOADING',
      };
      const message: Message = {
        type: 'LOADED',
        item: { type: 'file', details: {} },
      };
      expect(update(initialModel, message)).toEqual({
        state: 'LOADED',
        name: 'unkown',
      });
    });
  });

  describe('Component', () => {
    it('should render the spinner for the LOADING model', () => {
      const model: Model = {
        state: 'LOADING',
      };

      const c = mount(<Component model={model} dispatch={() => {}} />);
      expect(c.find(Spinner)).toHaveLength(1);
    });
  });

  describe('effects', () => {
    it('should emit the LOADED message when initialised successfully', done => {
      const subject = new Subject<MediaItem>();
      const context = Stubs.context(
        contextConfig,
        undefined,
        Stubs.mediaItemProvider(subject),
      ) as any;
      const item = {
        id: '',
        occurrenceKey: '',
        type: 'file' as MediaItemType,
      };
      const message: Message = {
        type: 'INIT',
        cfg: {
          context,
          dataSource: { list: [item] },
          initialItem: item,
        },
      };

      effects(message)!.then(nextMessage => {
        expect(nextMessage).toEqual({
          type: 'LOADED',
          item: {
            type: 'file',
            details: { id: 'my-id' },
          },
        });
        done();
      });

      subject.next({
        type: 'file',
        details: { id: 'my-id' },
      });
    });
  });
});
