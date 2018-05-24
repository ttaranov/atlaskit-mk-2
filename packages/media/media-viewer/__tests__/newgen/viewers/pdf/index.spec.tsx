import * as util from '../../../../src/newgen/util';
const constructAuthTokenUrlSpy = jest.spyOn(util, 'constructAuthTokenUrl');

import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import { FileItem } from '@atlaskit/media-core';
import { Stubs } from '../../../_stubs';
import { Spinner } from '../../../../src/newgen/loading';
import { PDFViewer } from '../../../../src/newgen/viewers/pdf/index';

function createContext() {
  const subject = new Subject<FileItem>();
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
    Stubs.mediaItemProvider(subject),
  ) as any;
}

function createFixture(fetchPromise, item, collectionName?) {
  const context = createContext();
  const onClose = jest.fn(() => fetchPromise);
  const el = mount(
    <PDFViewer item={item} context={context} collectionName={collectionName} />,
  );
  el.instance()['fetch'] = jest.fn();
  return { context, el, onClose };
}

describe('PDFViewer', () => {
  afterEach(() => {
    constructAuthTokenUrlSpy.mockClear();
  });

  it('assigns a document object when successful', async () => {
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
    await el.instance()['init']();

    expect(el.state()).toMatchObject({
      doc: {
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
    await el.instance()['init']();

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

    await el.instance()['init']();

    expect(el.state()).toMatchObject({
      doc: {
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
    await el.instance()['init']();
    expect(constructAuthTokenUrlSpy.mock.calls[0][2]).toEqual(collectionName);
  });
});
