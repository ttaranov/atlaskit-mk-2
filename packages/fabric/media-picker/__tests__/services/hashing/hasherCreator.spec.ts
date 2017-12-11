import { expect } from 'chai';
import * as sinon from 'sinon';

import * as simpleHasher from '../../../src/service/hashing/simpleHasher';
import * as workerHasher from '../../../src/service/hashing/workerHasher';
import { createHasher } from '../../../src/service/hashing/hasherCreator';

describe('createHasher', () => {
  const simple = { type: 'simple' };
  const worker = { type: 'worker' };

  let simpleStub: sinon.SinonStub;
  let workerStub: sinon.SinonStub;

  beforeEach(() => {
    simpleStub = sinon.stub(simpleHasher, 'SimpleHasher');
    workerStub = sinon.stub(workerHasher, 'WorkerHasher');
  });

  afterEach(() => {
    simpleStub.restore();
    workerStub.restore();
  });

  it('should create WorkerHasher by default', () => {
    simpleStub.returns(simple);
    workerStub.returns(worker);

    const hasher = createHasher();
    expect(hasher).to.deep.equal(worker);
  });

  it('should create SimpleHasher if WorkerHasher throws an exception', () => {
    simpleStub.returns(simple);
    workerStub.throws('some-error');

    const hasher = createHasher();
    expect(hasher).to.deep.equal(simple);
  });
});
