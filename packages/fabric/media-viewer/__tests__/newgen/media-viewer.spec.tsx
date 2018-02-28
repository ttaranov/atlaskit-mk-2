import * as React from 'react';
import {
  Model,
  initialModel,
  Message,
  update,
  Component,
  LeftInfo,
  effects,
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
    it('assigns file src when it was received', () => {
      const message: Message = {
        type: 'RECEIVED_SRC',
        src: 'https://atlassian.com',
        imgResolution: 'small',
      };
      const model = update(initialModel, message);
      expect(model).toMatchObject({
        state: 'OPEN',
        src: 'https://atlassian.com',
        imgResolution: 'small',
      });
    });

    it('sets file attributes when they are received', () => {
      const message: Message = {
        type: 'RECEIVED_ATTRIBUTES',
        name: 'test.jpg',
      };
      const model = update(initialModel, message);
      expect(model).toMatchObject({ name: 'test.jpg' });
    });

    it('switches to the ERROR state when loading failed', () => {
      const message: Message = {
        type: 'LOADING_FAILED',
      };
      const model = update(initialModel, message);
      expect(model).toMatchObject({ state: 'ERROR' });
    });
  });

  describe('Component', () => {
    it('should render the spinner as long as no src is known', () => {
      const c = mount(<Component model={initialModel} dispatch={() => {}} />);
      expect(c.find(Spinner)).toHaveLength(1);
    });

    it('renders "unknown" as the file name when name is an empty string', () => {
      const model: Model = {
        state: 'OPEN',
        name: '',
      };
      const c = mount(<Component model={model} dispatch={() => {}} />);
      expect(
        c
          .find(LeftInfo)
          .find('span')
          .text(),
      ).toEqual('unknown');
    });

    it('renders no file name when name is undefined', () => {
      const c = mount(<Component model={initialModel} dispatch={() => {}} />);
      expect(
        c
          .find(LeftInfo)
          .find('span')
          .text(),
      ).toEqual('');
    });
  });

  describe('effects', () => {
    const subject = new Subject<MediaItem>();
    const context = Stubs.context(
      contextConfig,
      undefined,
      Stubs.mediaItemProvider(subject),
    );
    const item = {
      id: '',
      occurrenceKey: '',
      type: 'file' as MediaItemType,
    };
    const message: Message = {
      type: 'INIT',
    };
    const cfg = {
      context,
      dataSource: { list: [item] },
      initialItem: item,
    };

    it('should dispatch RECEIVED_ATTRIBUTES while processing is pending', async () => {
      const dispatch = await new Promise((resolve, reject) => {
        const dispatch = jest.fn((msg: Message) => {
          if (msg.type === 'RECEIVED_ATTRIBUTES') {
            resolve(dispatch);
          }
        });
        effects(cfg, dispatch, message);
        subject.next({
          type: 'file',
          details: {
            id: 'my-id',
            name: 'test.png',
            processingStatus: 'pending',
          },
        });
      });

      expect(dispatch).toHaveBeenLastCalledWith({
        type: 'RECEIVED_ATTRIBUTES',
        name: 'test.png',
      });
    });

    it('should dispatch RECEIVED_SRC when processing has succeeded', async () => {
      const dispatch = await new Promise((resolve, reject) => {
        const dispatch = jest.fn((msg: Message) => {
          if (msg.type === 'RECEIVED_SRC') {
            resolve(dispatch);
          }
        });
        effects(cfg, dispatch, message);
        subject.next({
          type: 'file',
          details: {
            id: 'my-id',
            name: 'test.png',
            processingStatus: 'succeeded',
          },
        });
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: 'RECEIVED_SRC',
        src: '',
        imgResolution: 'small',
      });
    });
  });
});
