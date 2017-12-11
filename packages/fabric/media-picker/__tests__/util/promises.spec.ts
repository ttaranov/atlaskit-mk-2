import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { retryTask } from '../../src/util/promises';

chai.use(chaiAsPromised);

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

    it('should be fulfilled given 0 errors and 0 retries', done => {
      const errors = 0;
      const retries = 0;
      expect(
        retryTask(Mocks.taskThatErrors(errors), retries, delay),
      ).to.eventually.be.fulfilled.then(done);
    });

    it('should be rejected given 1 error and 0 retries', done => {
      const errors = 1;
      const retries = 0;
      expect(
        retryTask(Mocks.taskThatErrors(errors), retries, delay),
      ).to.eventually.be.rejected.then(done);
    });

    it('should be fulfilled given 1 error and 5 retries', done => {
      const errors = 1;
      const retries = 5;
      expect(
        retryTask(Mocks.taskThatErrors(errors), retries, delay),
      ).to.eventually.be.fulfilled.then(done);
    });

    it('should be fulfilled given 5 errors and 5 retries', done => {
      const errors = 5;
      const retries = 5;
      expect(
        retryTask(Mocks.taskThatErrors(errors), retries, delay),
      ).to.eventually.be.fulfilled.then(done);
    });

    it('should be rejected given 6 errors and 5 retries', done => {
      const errors = 6;
      const retries = 5;
      expect(
        retryTask(Mocks.taskThatErrors(errors), retries, delay),
      ).to.eventually.be.rejected.then(done);
    });
  });
});
