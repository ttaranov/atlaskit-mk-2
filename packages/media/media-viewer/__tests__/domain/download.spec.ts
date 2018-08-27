import { Subject } from 'rxjs';
import {
  Context,
  MediaItem,
  FileItem,
  Auth,
  ContextConfig,
} from '@atlaskit/media-core';
import { Stubs } from '../_stubs';
import { createDownloadUrl } from '../../src/newgen/domain/download';

function createContext(subject: Subject<MediaItem>): Context {
  const token = 'some-token';
  const clientId = 'some-client-id';
  const baseUrl = 'some-service-host';
  const authProvider = jest.fn(() =>
    Promise.resolve<Auth>({ token, clientId, baseUrl }),
  );
  const contextConfig: ContextConfig = {
    authProvider,
  };
  return Stubs.context(
    contextConfig,
    undefined,
    Stubs.mediaItemProvider(subject),
  ) as any;
}

describe('Download', () => {
  it('should generate a valid download link', async () => {
    const subject = new Subject<MediaItem>();
    const context = createContext(subject);
    const item: FileItem = {
      type: 'file',
      details: {
        id: '123',
      },
    };
    const url = await createDownloadUrl(item, context);
    const urlWithCollection = await createDownloadUrl(
      item,
      context,
      'some-collection',
    );

    expect(url).toEqual(
      'some-service-host/file/123/binary?client=some-client-id&token=some-token&dl=true',
    );
    expect(urlWithCollection).toEqual(
      'some-service-host/file/123/binary?client=some-client-id&collection=some-collection&token=some-token&dl=true',
    );
  });
});
