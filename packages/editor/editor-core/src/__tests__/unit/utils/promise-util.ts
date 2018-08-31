import { promiseAllWithNonFailFast } from '../../../utils/promise-util';

describe('@atlaskit/editor-core promise-util', () => {
  describe('promiseAllWithNonFailFast', () => {
    it('should pass all promises for happy path', () => {
      return promiseAllWithNonFailFast([
        Promise.resolve('foo'),
        Promise.resolve('boo'),
      ]).then(([a, b]) => {
        expect(a).toBe('foo');
        expect(b).toBe('boo');
      });
    });

    it('should process all promises even if first failed', () => {
      const errors: any[] = [];

      return promiseAllWithNonFailFast(
        [Promise.reject('yikes'), Promise.resolve('boo')],
        error => errors.push(error),
      ).then(([a, b]) => {
        expect(a).toBeUndefined();
        expect(b).toBe('boo');
        expect(errors.length).toBe(1);
        expect(errors).toContain('yikes');
      });
    });

    it('should process all promises even if all failed', () => {
      const errors: any[] = [];

      return promiseAllWithNonFailFast(
        [Promise.reject('yikes'), Promise.reject('boom')],
        error => errors.push(error),
      ).then(([a, b]) => {
        expect(a).toBeUndefined();
        expect(b).toBeUndefined();
        expect(errors.length).toBe(2);
        expect(errors).toContain('yikes');
        expect(errors).toContain('boom');
      });
    });

    it('should process all promises even if multiple failed', () => {
      const errors: any[] = [];

      return promiseAllWithNonFailFast(
        [
          Promise.reject('yikes'),
          Promise.resolve('success'),
          Promise.reject('boom'),
          Promise.resolve('victory'),
        ],
        error => errors.push(error),
      ).then(([a, b, c, d]) => {
        expect(a).toBeUndefined();
        expect(b).toBe('success');
        expect(c).toBeUndefined();
        expect(d).toBe('victory');
        expect(errors.length).toBe(2);
        expect(errors).toContain('yikes');
        expect(errors).toContain('boom');
      });
    });
  });
});
