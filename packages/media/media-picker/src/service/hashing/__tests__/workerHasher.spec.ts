jest.mock('rusha');

import * as sinon from 'sinon';
import * as Rusha from 'rusha';

import { WorkerHasher } from '../workerHasher';

interface FakeWorker {
  addEventListener: jest.Mock<any>;
  postMessage: sinon.SinonStub;
}

describe('WorkerHasher', () => {
  let fakeWorkerIndex: number;
  let fakeWorkers: Array<FakeWorker> = [];
  let createWorkerStub = jest.fn();

  beforeEach(() => {
    fakeWorkers.push({
      addEventListener: jest.fn(),
      postMessage: sinon.stub(),
    });
    fakeWorkerIndex = 0;
    createWorkerStub = jest
      .fn()
      .mockReturnValue(fakeWorkers[fakeWorkerIndex++]);

    (Rusha.createWorker as any) = createWorkerStub;
  });

  it('should start 3 workers if 3 workers are specified in the constructor', () => {
    // tslint:disable-next-line:no-unused-expression
    new WorkerHasher(3);
    expect(createWorkerStub).toHaveBeenCalledTimes(3);
  });

  it('should start 5 workers if 5 workers are specified in the constructor', () => {
    // tslint:disable-next-line:no-unused-expression
    new WorkerHasher(5);
    expect(createWorkerStub).toHaveBeenCalledTimes(5);
  });

  it('should call postMessage on a worker when hash is requested', done => {
    const chunk = {
      fileObj: {
        file: {
          slice: () => new Blob([]),
        },
      },
    };

    fakeWorkers.forEach(item => {
      item.postMessage.callsFake(() => done());
    });

    const hasher = new WorkerHasher(3);
    hasher.hash(chunk);
  });
});
