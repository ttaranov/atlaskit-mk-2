import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import { MediaItem, MediaItemType } from '@atlaskit/media-core';
import { Stubs } from '../_stubs';
import { Content } from '../../src/newgen/styled';
import { MediaViewer } from '../../src/newgen/media-viewer';

function createContext(subject, blobService?) {
  const token = 'some-token';
  const clientId = 'some-client-id';
  const serviceHost = 'some-service-host';
  const authProvider = jest.fn(() => Promise.resolve({ token, clientId }));
  const contextConfig = {
    serviceHost,
    authProvider,
  };
  return Stubs.context(
    contextConfig,
    undefined,
    subject && Stubs.mediaItemProvider(subject),
    blobService,
  ) as any;
}

function createFixture(identifier) {
  const subject = new Subject<MediaItem>();
  const blobService = Stubs.blobService();
  const context = createContext(subject, blobService);
  const onClose = jest.fn();
  const el = mount(
    <MediaViewer
      selectedItem={identifier}
      items={[identifier]}
      context={context}
      onClose={onClose}
    />,
  );
  return { blobService, subject, context, el, onClose };
}

describe('<MediaViewer />', () => {
  const identifier = {
    id: 'some-id',
    occurrenceKey: 'some-custom-occurrence-key',
    type: 'file' as MediaItemType,
  };

  it('should close Media Viewer on click', () => {
    const { el, onClose } = createFixture(identifier);
    el.find(Content).simulate('click');
    expect(onClose).toHaveBeenCalled();
  });
});
