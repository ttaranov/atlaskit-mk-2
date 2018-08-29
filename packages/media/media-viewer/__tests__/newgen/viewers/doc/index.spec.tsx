import * as util from '../../../../src/newgen/utils';
const constructAuthTokenUrlSpy = jest.spyOn(util, 'constructAuthTokenUrl');

import * as React from 'react';
import { mount } from 'enzyme';
import { FileItem } from '@atlaskit/media-core';
import { createContext } from '../../../_stubs';
import { Spinner } from '../../../../src/newgen/loading';
import { DocViewer } from '../../../../src/newgen/viewers/doc/index';
import { ErrorMessage, createError } from '../../../../src/newgen/error';
import Button from '@atlaskit/button';

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

    expect(el.state().src.status).toEqual('SUCCESSFUL');
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

  it('shows an error message and download button if no artifact found', async () => {
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

    const { src } = el.state();
    expect(src.status).toEqual('FAILED');
    expect(src.err).toEqual(createError('noPDFArtifactsFound'));

    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      'No PDF artifacts found for this file.',
    );

    // download button
    expect(errorMessage.text()).toContain(
      'Try downloading the file to view it',
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
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
