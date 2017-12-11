import { expect } from 'chai';
import * as sinon from 'sinon';
import { ResumableChunk } from 'resumablejs';

import { SimpleHasher } from '../../../src/service/hashing/simpleHasher';

interface FakeFileReader {
  readAsArrayBuffer: (blob: Blob) => void;
  onload?: (event: { target: FakeFileReader }) => void;
  result?: ArrayBuffer;
}

describe('SimpleHasher', () => {
  let oldFileReader: FileReader;
  let readAsArrayBuffer: sinon.SinonSpy;
  let fileReader: FakeFileReader;

  let simpleHasher: SimpleHasher;

  beforeEach(() => {
    // Save the previous FileReader. It will be restored in afterEach
    oldFileReader = (window as any)['FileReader'];

    readAsArrayBuffer = sinon.spy();
    fileReader = {
      readAsArrayBuffer,
    };
    (window as any)['FileReader'] = sinon.stub().returns(fileReader);

    simpleHasher = new SimpleHasher();
  });

  afterEach(() => {
    (window as any)['FileReader'] = oldFileReader;
  });

  it('should calculate hash of chunk and call preprocessFinished()', done => {
    const hashOfEmpty = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';

    const chunk = {
      fileObj: {
        file: {
          slice: () => new Blob([]),
        },
      },
      preprocessFinished: function(): void {
        expect(this.hash).to.equal(hashOfEmpty);
        done();
      },
    };

    simpleHasher.hash(chunk as ResumableChunk);

    expect(readAsArrayBuffer.callCount).to.equal(1);

    fileReader.result = new ArrayBuffer(0);
    fileReader.onload({ target: fileReader });
  });
});
