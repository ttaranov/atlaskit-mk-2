import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import Blanket from '@atlaskit/blanket';
import { MediaItem, MediaItemType, LinkItem } from '@atlaskit/media-core';
import { Stubs } from '../_stubs';
import { MediaViewer } from '../../src/newgen/media-viewer';
import { MediaViewerRenderer } from '../../src/newgen/media-viewer-renderer';

function createFixture(identifier) {
  const subject = new Subject<MediaItem>();
  const token = 'some-token';
  const clientId = 'some-client-id';
  const serviceHost = 'some-service-host';
  const authProvider = jest.fn(() => Promise.resolve({ token, clientId }));
  const contextConfig = {
    serviceHost,
    authProvider,
  };
  const context = Stubs.context(
    contextConfig,
    undefined,
    subject && Stubs.mediaItemProvider(subject),
  ) as any;
  const onClose = jest.fn();
  const el = mount(
    <MediaViewer data={identifier} context={context} onClose={onClose} />,
  );
  return { subject, context, el, onClose };
}

function getModel(el) {
  return el.find(MediaViewerRenderer).props().model;
}

describe('<MediaViewer />', () => {
  const identifier = {
    id: 'some-id',
    occurrenceKey: 'some-custom-occurrence-key',
    type: 'file' as MediaItemType,
  };

  it('previews an indicator while loading', () => {
    const { el } = createFixture(identifier);
    el.update();

    expect(getModel(el)).toMatchObject({
      type: 'LOADING',
    });
  });

  it('previews a single file when processing was successful', () => {
    const item: MediaItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'succeeded',
      },
    };
    const { subject, el } = createFixture(identifier);

    subject.next(item);
    el.update();

    expect(getModel(el)).toMatchObject({
      type: 'SUCCESS',
    });
  });

  it('previews an error when processing failed', () => {
    const item: MediaItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'failed',
      },
    };
    const { subject, el } = createFixture(identifier);

    subject.next(item);
    el.update();

    expect(getModel(el)).toMatchObject({
      type: 'FAILED',
    });
  });

  it('previews an error when opening a link', () => {
    const item: LinkItem = {
      type: 'link',
      details: {} as any,
    };
    const { subject, el } = createFixture(identifier);

    subject.next(item);
    el.update();

    expect(getModel(el)).toMatchObject({
      type: 'FAILED',
    });
  });

  it('previews an error message on error', () => {
    const { subject, el } = createFixture(identifier);

    subject.error(new Error('test'));
    el.update();

    expect(getModel(el)).toMatchObject({
      type: 'FAILED',
    });
  });

  it('should close Media Viewer on click', () => {
    const { el, onClose } = createFixture(identifier);
    el.find(Blanket).simulate('click');
    expect(onClose).toHaveBeenCalled();
  });
});
