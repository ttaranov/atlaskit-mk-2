import FileStreamCache from '../../context/fileStreamCache';
import { Observable } from 'rxjs/Observable';

describe('FileStreamCache', () => {
  it('should return the stream if already exist', () => {
    const cache = new FileStreamCache();
    const fileStream1 = Observable.create();

    cache.set('1', fileStream1);

    expect(cache.has('1')).toBeTruthy();
    expect(cache.has('2')).toBeFalsy();
    expect(cache.get('1')).toEqual(fileStream1);
  });

  it('createKey()', () => {
    expect(FileStreamCache.createKey('123')).toEqual('123');
    expect(
      FileStreamCache.createKey('123', { collectionName: 'some-collection' }),
    ).toEqual('123-some-collection');
    expect(
      FileStreamCache.createKey('123', {
        collectionName: 'collection',
        occurrenceKey: 'occurrenceKey',
      }),
    ).toEqual('123-collection-occurrenceKey');
    expect(
      FileStreamCache.createKey('123', { occurrenceKey: 'occurrenceKey' }),
    ).toEqual('123-occurrenceKey');
    expect(
      FileStreamCache.createKey('123', {
        collectionName: '',
        occurrenceKey: '',
      }),
    ).toEqual('123');
  });
});
