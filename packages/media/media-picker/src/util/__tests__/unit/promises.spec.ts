import { retryTask } from '../../promises';

class Mocks {
  static taskThatErrors(errors: number = 0): () => Promise<void> {
    let errorsLeft = errors;
    return () =>
      new Promise<void>((resolve, reject) => {
        if (errorsLeft > 0) {
          errorsLeft = errorsLeft - 1;
          reject(errorsLeft);
        } else {
          resolve();
        }
      });
  }
}

describe('Promises', () => {
  describe('retry', () => {
    const delay = 0;

    it('should be fulfilled given 0 errors and 0 retries', () => {
      const errors = 0;
      const retries = 0;

      return expect(
        retryTask(Mocks.taskThatErrors(errors), retries, delay),
      ).resolves.toEqual(undefined);
    });

    it('should be rejected given 1 error and 0 retries', () => {
      const errors = 1;
      const retries = 0;

      return expect(
        retryTask(Mocks.taskThatErrors(errors), retries, delay),
      ).rejects.toEqual(expect.anything());
    });

    it('should be fulfilled given 1 error and 5 retries', () => {
      const errors = 1;
      const retries = 5;

      return expect(
        retryTask(Mocks.taskThatErrors(errors), retries, delay),
      ).resolves.toEqual(undefined);
    });

    it('should be fulfilled given 5 errors and 5 retries', () => {
      const errors = 5;
      const retries = 5;

      return expect(
        retryTask(Mocks.taskThatErrors(errors), retries, delay),
      ).resolves.toEqual(undefined);
    });

    it('should be rejected given 6 errors and 5 retries', () => {
      const errors = 6;
      const retries = 5;

      return expect(
        retryTask(Mocks.taskThatErrors(errors), retries, delay),
      ).rejects.toEqual(expect.anything());
    });
  });
});
