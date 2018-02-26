import * as React from 'react';
import {
  reducer,
  effects,
  State,
  Action,
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

  describe('reducer', () => {
    it('once loaded the name is saved as unkown', () => {
      const initialState: State = {
        type: 'LOADING',
      };
      const action: Action = {
        type: 'LOADED',
        item: { type: 'file', details: {} },
      };
      expect(reducer(initialState, action)).toEqual({
        type: 'LOADED',
        name: 'unkown',
      });
    });
  });

  describe('Component', () => {
    it('should render the spinner for the LOADING state', () => {
      const state: State = {
        type: 'LOADING',
      };

      const c = mount(<Component {...state} dispatch={() => {}} />);
      expect(c.find(Spinner)).toHaveLength(1);
    });
  });

  describe('effects', () => {
    it('should emit the LOADED action when initialised successfully', done => {
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
      const action: Action = {
        type: 'INIT',
        props: {
          context,
          dataSource: { list: [item] },
          initialItem: item,
        },
      };

      effects(action)!.then(resultAction => {
        expect(resultAction).toEqual({
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
