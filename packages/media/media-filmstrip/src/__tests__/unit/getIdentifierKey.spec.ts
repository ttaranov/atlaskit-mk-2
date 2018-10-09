import {
  FileIdentifier,
  LinkIdentifier,
  ExternalImageIdentifier,
} from '@atlaskit/media-card';
import { getIdentifierKey } from '../../utils/getIdentifierKey';

describe('getIdentifierKey()', () => {
  it('should return a new key for new identifiers', () => {
    const firstKey = getIdentifierKey({
      mediaItemType: 'file',
      id: 'id-1',
    });
    const secondKey = getIdentifierKey({
      mediaItemType: 'file',
      id: 'id-2',
    });

    expect(firstKey).toEqual('id-1');
    expect(secondKey).toEqual('id-2');
  });

  it('should return the same for the same identifier', () => {
    const fileIdentifier: FileIdentifier = {
      mediaItemType: 'file',
      id: 'id',
    };
    const firstKey = getIdentifierKey(fileIdentifier);
    const secondKey = getIdentifierKey(fileIdentifier);

    expect(firstKey).toEqual('id');
    expect(firstKey).toEqual(secondKey);
  });

  it('should work with links', () => {
    const linkIdentifier: LinkIdentifier = {
      mediaItemType: 'link',
      id: 'id',
      collectionName: 'some-collection',
    };

    expect(getIdentifierKey(linkIdentifier)).toEqual('id');
  });

  it('should work with external images', () => {
    const linkIdentifier: ExternalImageIdentifier = {
      mediaItemType: 'external-image',
      dataURI: 'some-external-img',
    };

    expect(getIdentifierKey(linkIdentifier)).toEqual('some-external-img');
  });

  it('should work with promises', () => {
    const firstPromise = Promise.resolve('id');
    const firstDeferredIdentifier: FileIdentifier = {
      mediaItemType: 'file',
      id: firstPromise,
    };
    const secondDeferredIdentifier: FileIdentifier = {
      mediaItemType: 'file',
      id: Promise.resolve('id'),
    };
    const firstKey = getIdentifierKey(firstDeferredIdentifier);
    const secondKey = getIdentifierKey(secondDeferredIdentifier);

    expect(firstKey).not.toEqual(secondKey);
    expect(
      getIdentifierKey({ mediaItemType: 'file', id: firstPromise }),
    ).toEqual(firstKey);
  });
});
