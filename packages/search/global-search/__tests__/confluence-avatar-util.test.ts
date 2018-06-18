import { getAvatarForConfluenceObjectResult } from '../src/util/confluence-avatar-util';
import { makeConfluenceObjectResult } from './_test-util';
import { ContentType } from '../src/model/Result';

describe('confluence-avatar-util', () => {
  it('should return correct avatar', () => {
    const confluenceResult = makeConfluenceObjectResult({
      name: 'test.png',
      iconClass: 'icon-file-image',
      contentType: ContentType.ConfluenceAttachment,
    });

    const result = getAvatarForConfluenceObjectResult(confluenceResult);

    expect(result).toEqual('abc');
  });
});
