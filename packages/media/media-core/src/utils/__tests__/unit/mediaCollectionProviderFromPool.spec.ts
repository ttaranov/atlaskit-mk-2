import { Observable } from 'rxjs/Observable';
import { Pool } from '../../../providers/util/pool';
import { MediaCollectionProvider } from '../../../providers/mediaCollectionProvider';
import { mediaCollectionProviderFromPool } from '../../../providers/util/mediaCollectionProviderFromPool';

const noop = () => {
  /* do nothing */
};

describe('mediaCollectionProviderFromPool()', () => {
  it('should create a provider when called once', () => {
    const pool = new Pool<MediaCollectionProvider>();
    const createFn = jest.fn(() => ({
      observable: () => Observable.create(noop),
      refresh: jest.fn(),
      loadNextPage: jest.fn(),
    }));

    mediaCollectionProviderFromPool(pool, 'id', createFn);
    expect(createFn).toHaveBeenCalledTimes(1);
  });

  it('should create one provider when called twice with the same ID', () => {
    const pool = new Pool<MediaCollectionProvider>();
    const createFn = jest.fn(() => ({
      observable: () => Observable.create(noop),
      refresh: jest.fn(),
      loadNextPage: jest.fn(),
    }));

    const provider1 = mediaCollectionProviderFromPool(pool, 'id', createFn);
    const provider2 = mediaCollectionProviderFromPool(pool, 'id', createFn);
    expect(createFn).toHaveBeenCalledTimes(1);
    expect(provider1).toEqual(provider2);
  });

  it('should create one provider when called twice with the same ID and subscribed', () => {
    const pool = new Pool<MediaCollectionProvider>();
    const createFn = jest.fn(() => ({
      observable: () => Observable.create(noop),
      refresh: jest.fn(),
      loadNextPage: jest.fn(),
    }));

    const provider1 = mediaCollectionProviderFromPool(pool, 'id', createFn);
    provider1.observable().subscribe(noop);
    const provider2 = mediaCollectionProviderFromPool(pool, 'id', createFn);
    expect(createFn).toHaveBeenCalledTimes(1);
    expect(provider1).toEqual(provider2);
  });

  it('should create two different providers when called twice with different IDs', () => {
    const pool = new Pool<MediaCollectionProvider>();
    const createFn = jest.fn(() => ({
      observable: () => Observable.create(noop),
      refresh: jest.fn(),
      loadNextPage: jest.fn(),
    }));

    const provider1 = mediaCollectionProviderFromPool(pool, 'id1', createFn);
    const provider2 = mediaCollectionProviderFromPool(pool, 'id2', createFn);
    expect(createFn).toHaveBeenCalledTimes(2);
    expect(provider1).not.toEqual(provider2);
  });

  it('should create two providers when called twice with the same ID but the first provider has been released', () => {
    const pool = new Pool<MediaCollectionProvider>();
    const createFn = jest.fn(() => ({
      observable: () => Observable.create(noop),
      refresh: jest.fn(),
      loadNextPage: jest.fn(),
    }));

    const provider1 = mediaCollectionProviderFromPool(pool, 'id', createFn);
    provider1
      .observable()
      .subscribe(noop)
      .unsubscribe();

    const provider2 = mediaCollectionProviderFromPool(pool, 'id', createFn);
    expect(createFn).toHaveBeenCalledTimes(2);
    expect(provider1).not.toEqual(provider2);
  });
});
