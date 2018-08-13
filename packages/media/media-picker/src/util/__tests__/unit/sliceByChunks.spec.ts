import { expect } from 'chai';
import { sliceByChunks } from '../../sliceByChunks';

describe('sliceByChunks', () => {
  it('returns one chunk if array is less or equal then MaxSize', () => {
    expect(sliceByChunks([1, 2, 3], 3)).to.be.deep.equal([[1, 2, 3]]);
    expect(sliceByChunks([1, 2, 3], 4)).to.be.deep.equal([[1, 2, 3]]);
  });

  it('returns more then one chunk if array is bigger then MaxSize', () => {
    expect(sliceByChunks([1, 2, 3, 4], 3)).to.be.deep.equal([[1, 2, 3], [4]]);
    expect(sliceByChunks([1, 2, 3, 4, 5, 6], 3)).to.be.deep.equal([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    expect(sliceByChunks([1, 2, 3, 4, 5, 6, 7], 3)).to.be.deep.equal([
      [1, 2, 3],
      [4, 5, 6],
      [7],
    ]);
  });
});
