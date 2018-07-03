import * as util from '../../../../../newgen/util';
const constructAuthTokenUrlSpy = jest.spyOn(util, 'constructAuthTokenUrl');

import * as React from 'react';
import { mount } from 'enzyme';
import { FileItem } from '@atlaskit/media-core';
import { createContext } from '../../../_stubs';
import { Spinner } from '../../../../../newgen/loading';
import { DocViewer } from '../../../../../newgen/viewers/doc/index';

function createFixture(
  fetchPromise: Promise<any>,
  item: FileItem,
  collectionName?: string,
) {
  const context = createContext(undefined as any);
  const onClose = jest.fn(() => fetchPromise);
  const el = mount(
    <DocViewer item={item} context={context} collectionName={collectionName} />,
  );
  (el as any).instance()['fetch'] = jest.fn();
  return { context, el, onClose };
}

describe('DocViewer', () => {
  afterEach(() => {
    constructAuthTokenUrlSpy.mockClear();
  });

  it('assigns a document src when successful', async () => {
    const fetchPromise = Promise.resolve();
    const item: FileItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'succeeded',
        mediaType: 'doc',
        artifacts: {
          'document.pdf': {
            url: '/pdf',
          },
        },
      },
    };
    const { el } = createFixture(fetchPromise, item);
    await (el as any).instance()['init']();

    expect(el.state()).toMatchObject({
      src: {
        status: 'SUCCESSFUL',
      },
    });
  });

  it('shows an indicator while loading', async () => {
    const fetchPromise = new Promise(() => {});
    const item: FileItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'succeeded',
        mediaType: 'doc',
        artifacts: {
          'document.pdf': {
            url: '/pdf',
          },
        },
      },
    };
    const { el } = createFixture(fetchPromise, item);
    await (el as any).instance()['init']();

    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows an error if no artifact found', async () => {
    const fetchPromise = Promise.resolve(() => {});
    const item: FileItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'succeeded',
        mediaType: 'doc',
        artifacts: {},
      },
    };
    const { el } = createFixture(fetchPromise, item);

    await (el as any).instance()['init']();

    expect(el.state()).toMatchObject({
      src: {
        status: 'FAILED',
        err: new Error('no pdf artifacts found for this file'),
      },
    });
  });

  it('MSW-720: passes collectionName to constructAuthTokenUrl', async () => {
    const collectionName = 'some-collection';
    const fetchPromise = Promise.resolve();
    const item: FileItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'succeeded',
        mediaType: 'doc',
        artifacts: {
          'document.pdf': {
            url: '/pdf',
          },
        },
      },
    };
    const { el } = createFixture(fetchPromise, item, collectionName);
    await (el as any).instance()['init']();
    expect(constructAuthTokenUrlSpy.mock.calls[0][2]).toEqual(collectionName);
  });
});
