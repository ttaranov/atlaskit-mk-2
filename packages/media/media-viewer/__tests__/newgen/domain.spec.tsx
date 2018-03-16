import { Subject } from 'rxjs/Subject';
import { StoreImpl, Identifier } from '../../src/newgen/domain';
import { Stubs } from '../_stubs';
import { MediaItemType, MediaItem } from '@atlaskit/media-core';

const token = 'some-token';
const clientId = 'some-client-id';
const serviceHost = 'some-service-host';
const authProvider = jest.fn(() => Promise.resolve({ token, clientId }));
const contextConfig = {
  serviceHost,
  authProvider,
};

describe('Store', () => {
  const identifier: Identifier = {
    id: '',
    type: 'doc' as MediaItemType,
    occurrenceKey: ''
  };

  it('should emit an event when the underlaying provider does', (done) => {
    const subject = new Subject<MediaItem>();

    const context = Stubs.context(
      contextConfig,
      undefined,
      Stubs.mediaItemProvider(subject),
    ) as any;

    const store = new StoreImpl(context as any, identifier);
    store.subscribe(model => {
      done();
    });

    subject.next({
      type: 'file',
      details: {
        processingStatus: 'succeeded'
      }
    });
  });
});
