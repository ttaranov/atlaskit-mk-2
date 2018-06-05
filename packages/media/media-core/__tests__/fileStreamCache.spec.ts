import FileStreamCache from '../src/context/fileStreamCache';
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
});
