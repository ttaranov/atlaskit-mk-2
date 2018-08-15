import { getUrlParameter } from '../../getUrlParameter';
import { expect } from 'chai';

describe('getUrlParameter helper method', () => {
  it('returns value if parameter exists in url', () => {
    expect(getUrlParameter('value', '?value=123')).to.be.equal('123');
    expect(getUrlParameter('value', '?text=abc&obj={}&value=345')).to.be.equal(
      '345',
    );
  });

  it('returns undefined if parameter does not exist', () => {
    expect(getUrlParameter('value', '')).to.be.equal(undefined);
    expect(getUrlParameter('value', '?')).to.be.equal(undefined);
    expect(getUrlParameter('value', '?text=abc&obj={}')).to.be.equal(undefined);
  });
});
