import { FileIdentifier, UrlPreviewIdentifier } from '../../../root';
import { isFileIdentifier, isUrlPreviewIdentifier } from '../../identifier';

const fileIdentifier: FileIdentifier = {
  mediaItemType: 'file',
  id: 'some-id',
};
const urlPreviewIdentifier: UrlPreviewIdentifier = {
  mediaItemType: 'link',
  url: 'some-url',
};

describe('isUrlPreviewIdentifier', () => {
  it("should return false when it's not a url preview identifier", () => {
    expect(isUrlPreviewIdentifier(fileIdentifier)).toBe(false);
  });
  it('should return true when it is a url preview identifier', () => {
    expect(isUrlPreviewIdentifier(urlPreviewIdentifier)).toBe(true);
  });
});

describe('isFileIdentifier', () => {
  it('should return true when it is a file identifier', () => {
    expect(isFileIdentifier(fileIdentifier)).toBe(true);
  });
  it("should return false when it's not a file identifier", () => {
    expect(isFileIdentifier(urlPreviewIdentifier)).toBe(false);
  });
});
