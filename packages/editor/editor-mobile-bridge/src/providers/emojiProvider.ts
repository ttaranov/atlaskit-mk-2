import { EmojiResource } from '@atlaskit/editor-core';
import { createPromise } from '../cross-platform-promise';

function getCloudId() {
  return createPromise<any>('getEmojiMeta').submit();
}

function createEmojiProvider() {
  return getCloudId().then(data => {
    const { cloudId, baseUrl } = data;

    // TODO get correct type EmojiResourceConfig
    const config: any = {
      providers: [
        {
          url: `${baseUrl}/standard`,
        },
        {
          url: `${baseUrl}/atlassian`,
        },
      ],
    };

    if (cloudId) {
      config.providers.push({
        url: `${baseUrl}/${cloudId}/site`,
      });
    }

    return new EmojiResource(config);
  });
}

export default Promise.resolve(createEmojiProvider());
