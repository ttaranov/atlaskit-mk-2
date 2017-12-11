import { expect } from 'chai';
import * as sinon from 'sinon';
import { ResumableChunk } from 'resumablejs';

import { WorkerHasher } from '../../../src/service/hashing/workerHasher';

interface FakeWorker {
  addEventListener: sinon.SinonSpy;
  postMessage: sinon.SinonStub;
}

describe('WorkerHasher', () => {
  let oldWorker: Worker;
  let workerStub: sinon.SinonStub;

  let oldFileReader: FileReader;

  let fakeWorkerIndex: number;
  let fakeWorkers: Array<FakeWorker>;

  beforeEach(() => {
    const createFakeWorkers = (numOfWorkers: number) => {
      fakeWorkers.push({
        addEventListener: sinon.spy(),
        postMessage: sinon.stub(),
      });
    };

    fakeWorkers = [];
    fakeWorkerIndex = 0;
    createFakeWorkers(5);

    // Replace Worker property of the window
    workerStub = sinon.stub().returns(fakeWorkers[fakeWorkerIndex++]);
    oldWorker = (window as any)['Worker'];
    (window as any)['Worker'] = workerStub;

    // Replace FileReader property of the window
    oldFileReader = (window as any)['FileReader'];
    (window as any)['FileReader'] = sinon.stub().returns({
      readAsBinaryString: function(): void {
        this.onload();
      },
    });
  });

  afterEach(() => {
    // Restore Worker property of the window
    (window as any)['Worker'] = oldWorker;

    // Restore FileReader of the window
    (window as any)['FileReader'] = oldFileReader;
  });

  it('should start 3 workers if 3 workers are specified in the constructor', () => {
    // tslint:disable-next-line:no-unused-expression
    new WorkerHasher(3);
    expect(workerStub.callCount).to.equal(3);
  });

  it('should start 5 workers if 5 workers are specified in the constructor', () => {
    // tslint:disable-next-line:no-unused-expression
    new WorkerHasher(5);
    expect(workerStub.callCount).to.equal(5);
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
      item.postMessage.callsFake(() => {
        done();
      });
    });

    const hasher = new WorkerHasher(3);
    hasher.hash(chunk as ResumableChunk);
  });
});
