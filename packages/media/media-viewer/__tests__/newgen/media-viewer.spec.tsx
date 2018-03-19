import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import Blanket from '@atlaskit/blanket';
import { Stubs } from '../_stubs';
import { MediaViewer } from '../../src/newgen/media-viewer';
import { MediaViewerRenderer } from '../../src/newgen/media-viewer-renderer';
import { MediaItem, MediaItemType } from '@atlaskit/media-core';

describe('<MediaViewer />', () => {
  const token = 'some-token';
  const clientId = 'some-client-id';
  const serviceHost = 'some-service-host';
  const authProvider = jest.fn(() => Promise.resolve({ token, clientId }));
  const contextConfig = {
    serviceHost,
    authProvider,
  };

  const item = {
    id: 'some-id',
    occurrenceKey: 'some-custom-occurrence-key',
    type: 'file' as MediaItemType,
  };

  it('should close Media Viewer on click', () => {
    const context = Stubs.context(contextConfig);
    const onClose = jest.fn();
    const el = mount(
      <MediaViewer data={item} context={context as any} onClose={onClose} />,
    );
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
    const el = mount(<MediaViewer data={item} context={context as any} />);

    subject.next({
      type: 'file',
      details: {
        mediaType: 'image',
        id: 'stub',
      },
    });

    expect(el.find(MediaViewerRenderer)).toHaveLength(1);
  });

  it.skip('shows a list of items with a selected file');
  it.skip('shows a list of items without a selected file');
  it.skip('shows a selected file from a collection');
  it.skip('shows a file from a collection without a selection');
  it.skip(
    'shows an error message if selectedItem is different from provided item',
  );
  it.skip('shows an error message if selectedItem can not be found in list');
  it.skip(
    'shows an error message if selectedItem can not be found in collection',
  );
  it.skip('unsubscribes from the provider when unmounted');
  it.skip('resubscribes to the provider when properties changed');
});
