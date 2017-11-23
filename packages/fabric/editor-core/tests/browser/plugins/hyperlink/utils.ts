import { expect } from 'chai';
import { getLinkMatch, normalizeUrl } from '../../../../src/plugins/hyperlink/utils';

describe('hyperlink', () => {
  describe('#normalizeUrl', () => {
    const examples = [
      ['prettyandsimple@example.com', 'mailto:prettyandsimple@example.com'],
      ['mailto:prettyandsimple@example.com', 'mailto:prettyandsimple@example.com'],
      ['example.com', 'http://example.com'],
      ['http://example.com', 'http://example.com'],
      ['', '']
    ];

    examples.forEach(([actual, expected]) => {
      it(`should convert from "${actual}" -> "${expected}"`, () => {
        expect(normalizeUrl(actual)).to.eq(expected);
      });
    });
  });

  describe('getLinkMatch', () => {
    const noise = (url: string) =>
      `some text before ${url} and some more text after`;
    it('should match web URLs', () => {
      expect(getLinkMatch('http://localhost:1988')).to.not.equal(undefined);
      expect(getLinkMatch('http://www.atlassian.com')).to.not.equal(undefined);
      expect(getLinkMatch('http://www.atlassian.com/')).to.not.equal(undefined);
      expect(getLinkMatch('https://atlassian.com')).to.not.equal(undefined);
      expect(getLinkMatch('https://atlassian.com/')).to.not.equal(undefined);
      expect(getLinkMatch('www.atlassian.com')).to.not.equal(undefined);
      expect(getLinkMatch('www.atlassian.com/')).to.not.equal(undefined);
      expect(getLinkMatch('www.atlassian.com/foo/bar')).to.not.equal(undefined);
      expect(getLinkMatch('www.atlassian.com:12313/foo/bar')).to.not.equal(undefined);
      expect(getLinkMatch('www.atlassian.com/foo/bar#foo')).to.not.equal(undefined);
      expect(getLinkMatch('www.atlassian.com/foo/bar?foo#bar')).to.not.equal(undefined);
    });

    it('should match only the link when surrounded with text', () => {
      expect(getLinkMatch(noise('http://localhost:1988'))!.raw).to.equal('http://localhost:1988');
      expect(getLinkMatch(noise('http://www.atlassian.com'))!.raw).to.equal('http://www.atlassian.com');
      expect(getLinkMatch(noise('http://www.atlassian.com/'))!.raw).to.equal('http://www.atlassian.com/');
      expect(getLinkMatch(noise('https://atlassian.com'))!.raw).to.equal('https://atlassian.com');
      expect(getLinkMatch(noise('https://atlassian.com/'))!.raw).to.equal('https://atlassian.com/');
      expect(getLinkMatch(noise('www.atlassian.com'))!.raw).to.equal('www.atlassian.com');
      expect(getLinkMatch(noise('www.atlassian.com/'))!.raw).to.equal('www.atlassian.com/');
      expect(getLinkMatch(noise('www.atlassian.com/foo/bar'))!.raw).to.equal('www.atlassian.com/foo/bar');
      expect(getLinkMatch(noise('www.atlassian.com:12313/foo/bar'))!.raw).to.equal('www.atlassian.com:12313/foo/bar');
      expect(getLinkMatch(noise('www.atlassian.com/foo/bar#foo'))!.raw).to.equal('www.atlassian.com/foo/bar#foo');
      expect(getLinkMatch(noise('www.atlassian.com/foo/bar?foo#bar'))!.raw).to.equal('www.atlassian.com/foo/bar?foo#bar');
    });

    it('should not match non-web schemes', () => {
      expect(getLinkMatch('#hello')).to.equal(null);
      expect(getLinkMatch('./index.php')).to.equal(null);
      expect(getLinkMatch('/index.php')).to.equal(null);
      expect(getLinkMatch('app://atlassian.com')).to.equal(null);
      expect(getLinkMatch('tcp://173.123.21.12')).to.equal(null);
      expect(getLinkMatch('javascript:alert(1);')).to.equal(null);
    });

    it('should not match special characters', () => {
      expect(getLinkMatch('[www.atlassian.com?hello=there]')!.raw).to.equal('www.atlassian.com?hello=there');
      expect(getLinkMatch('(www.atlassian.com#hello>')!.raw).to.equal('www.atlassian.com#hello');
      expect(getLinkMatch('(www.atlassian.com/hello<')!.raw).to.equal('www.atlassian.com/hello');
      expect(getLinkMatch('(www.atlassian.com/hello?foo=bar^)')!.raw).to.equal('www.atlassian.com/hello?foo=bar^');
    });

    it('should match EMAILs', () => {
      expect(getLinkMatch('prettyandsimple@example.com')).to.not.equal(undefined);
      expect(getLinkMatch('very.common@example.com')).to.not.equal(undefined);
      expect(getLinkMatch('disposable.style.email.with+symbol@example.com')).to.not.equal(undefined);
      expect(getLinkMatch('other.email-with-dash@example.com')).to.not.equal(undefined);
      expect(getLinkMatch('x@example.com')).to.not.equal(undefined);
      expect(getLinkMatch('example-indeed@strange-example.com')).to.not.equal(undefined);
      expect(getLinkMatch('example@s.solutions')).to.not.equal(undefined);
    });

    it('should not match invalid EMAILs', () => {
      expect(getLinkMatch('john.doe@example..com')).to.equal(null);
    });

    it('should match only the EMAIL when surrounded with text', () => {
      expect(getLinkMatch(noise('http://localhost:1988'))!.raw).to.equal('http://localhost:1988');
      expect(getLinkMatch(noise('prettyandsimple@example.com'))!.raw).to.equal('prettyandsimple@example.com');
      expect(getLinkMatch(noise('very.common@example.com'))!.raw).to.equal('very.common@example.com');
      expect(getLinkMatch(noise('disposable.style.email.with+symbol@example.com'))!.raw).to.equal('disposable.style.email.with+symbol@example.com');
      expect(getLinkMatch(noise('other.email-with-dash@example.com'))!.raw).to.equal('other.email-with-dash@example.com');
      expect(getLinkMatch(noise('x@example.com'))!.raw).to.equal('x@example.com');
      expect(getLinkMatch(noise('example-indeed@strange-example.com'))!.raw).to.equal('example-indeed@strange-example.com');
    });

    it('should not match filename extensions', () => {
      expect(getLinkMatch('test.sh')).to.equal(null);
      expect(getLinkMatch('test.as')).to.equal(null);
      expect(getLinkMatch('test.ms')).to.equal(null);
      expect(getLinkMatch('test.py')).to.equal(null);
      expect(getLinkMatch('test.ps')).to.equal(null);
      expect(getLinkMatch('test.so')).to.equal(null);
      expect(getLinkMatch('test.pl')).to.equal(null);
    });
  });
});
