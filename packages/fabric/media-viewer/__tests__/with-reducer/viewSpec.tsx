import * as React from 'react';
import { mount } from 'enzyme'; // mount
import { Component, reducer, Action } from '../../src/with-reducer/view';
import { Button } from '../../src/newgen/components/viewer/toolbar/styled';

import { MediaItemType } from '@atlaskit/media-core';
import {
  MediaViewerItemType,
  ProcessingStatus,
} from '../../src/newgen/domain/index';

const item = {
  identifier: {
    id: '1',
    occurrenceKey: '',
    collection: 'col1',
    mediaItemType: 'file' as MediaItemType,
  },
  processingStatus: ProcessingStatus.Processed,
  metadata: {
    fullSizeUrl: 'https://picsum.photos/500/300?image=0',
  },
  type: MediaViewerItemType.Image,
};

const defaultState = {
  zoomLevel: 100,
  annotate: false,
  comment: false,
  selectedItem: item,
};

describe('with reducer: <View />', () => {
  describe('reducer', () => {
    it('increases the zoom level correctly', () => {
      const action: Action = { type: 'ZOOMIN' };
      const newState = reducer(defaultState, action);
      expect(newState.zoomLevel).toBeGreaterThan(defaultState.zoomLevel);
    });

    it('decreases the zoom level correctly', () => {
      const action: Action = { type: 'ZOOMOUT' };
      const newState = reducer(defaultState, action);
      expect(newState.zoomLevel).toBeLessThan(defaultState.zoomLevel);
    });
  });

  describe('Component', () => {
    it('should emit the correct action for zooming in', done => {
      const dispatch = action => {
        expect(action.type).toEqual('ZOOMIN');
        done();
      };
      const view = mount(<Component {...defaultState} dispatch={dispatch} />);
      view
        .find(Button)
        .at(0)
        .simulate('click');
    });

    it('should emit the correct action for zooming out', done => {
      const dispatch = action => {
        expect(action.type).toEqual('ZOOMOUT');
        done();
      };
      const view = mount(<Component {...defaultState} dispatch={dispatch} />);
      view
        .find(Button)
        .at(1)
        .simulate('click');
    });
  });
});
