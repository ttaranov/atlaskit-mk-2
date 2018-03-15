import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import Blanket from '@atlaskit/blanket';
import { Stubs } from '../_stubs';
import { MediaViewer } from '../../src/newgen/media-viewer';
import { MediaViewerRenderer } from '../../src/newgen/media-viewer-renderer';

describe('<MediaViewer />', () => {
  const token = 'some-token';
  const clientId = 'some-client-id';
  const serviceHost = 'some-service-host';
  const authProvider = jest.fn(() => Promise.resolve({ token, clientId }));
  const contextConfig = {
    serviceHost,
    authProvider,
  };

  it.skip('should close Media Viewer on click', () => {
    const onClose = jest.fn();
    const el = mount(<MediaViewer onClose={onClose} />);
    el.find(Blanket).simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  // TODO CAN WE USE OBSERVABLE OF?
  it('shows a single item', () => {
    const subject = new Subject<MediaItem>();
    const context = Stubs.context(
      contextConfig,
      undefined,
      Stubs.mediaItemProvider(subject),
    );

    const item = {
      id: 'some-id',
      occurrenceKey: 'some-custom-occurrence-key',
      type: 'file' as MediaItemType,
    };

    const el = mount(<MediaViewer data={item} context={context} />);

    subject.next({
      type: 'file',
      details: {
        id: 'stub',
      },
    });

    expect(el.find(MediaViewerRenderer)).toHaveLength(1);
  });

  it.skip('shows a list of items with a selected file', () => {
    const context = {};
    const list = ['', ''];
    const selected = '';
    const el = mount(
      <MediaViewer data={list} selected={selected} context={context} />,
    );
  });

  it.skip('shows a list of items without a selected file', () => {
    const context = {};
    const list = ['', ''];
    const selected = '';
    const el = mount(<MediaViewer data={list} context={context} />);
  });

  it.skip('shows a selected file from a collection', () => {
    const context = {};
    const collection;
    const selected;
    const el = mount(
      <MediaViewer data={collection} selected={selected} context={context} />,
    );
  });

  it.skip('shows a file from a collection without a selection', () => {
    const context = {};
    const collection;
    const el = mount(<MediaViewer data={collection} context={context} />);
  });

  it.skip(
    'shows an error message if selectedItem is different from provided item',
  );
  it.skip('shows an error message if selectedItem can not be found in list');
  it.skip(
    'shows an error message if selectedItem can not be found in collection',
  );

  // TODO on remounting we will resubscribe
});
