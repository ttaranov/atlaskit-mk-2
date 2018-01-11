import * as React from 'react';
import { storyData as mentionStoryData } from '@atlaskit/mention/dist/es5/support';
// import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
// import { storyData as taskDecisionStoryData } from '@atlaskit/task-decision/dist/es5/support';
// import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';

import { MentionResource } from '@atlaskit/mention';

const rejectedPromise = Promise.reject(
  new Error('Simulated provider rejection'),
);
const pendingPromise = new Promise<any>(() => {});

const testCloudId = 'f7ebe2c0-0309-4687-b913-41d422f2110b';
export const providers = {
  mentionProvider: {
    resolved: Promise.resolve(mentionStoryData.resourceProvider),
    external: Promise.resolve(
      new MentionResource({
        url: `https://api-private.stg.atlassian.com/mentions/${testCloudId}`,
        containerId: 'b0d035bd-9b98-4386-863b-07286c34dc14',
        productId: 'chat',
      }),
    ),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
  // emojiProvider: {
  //   resolved: emojiStoryData.getEmojiResource({ uploadSupported: true }),
  //   external: Promise.resolve(
  //     new EmojiResource({
  //       providers: [
  //         {
  //           url: 'https://api-private.stg.atlassian.com/emoji/standard',
  //         },
  //         {
  //           url: `https://api-private.stg.atlassian.com/emoji/${testCloudId}/site`,
  //         },
  //       ],
  //       allowUpload: true,
  //     }),
  //   ),
  //   pending: pendingPromise,
  //   rejected: rejectedPromise,
  //   undefined: undefined,
  // },
  // taskDecisionProvider: {
  //   resolved: Promise.resolve(
  //     taskDecisionStoryData.getMockTaskDecisionResource(),
  //   ),
  //   pending: pendingPromise,
  //   rejected: rejectedPromise,
  //   undefined: undefined,
  // },
  // contextIdentifierProvider: {
  //   resolved: storyContextIdentifierProviderFactory(),
  //   pending: pendingPromise,
  //   rejected: rejectedPromise,
  //   undefined: undefined,
  // },
  // mediaProvider: {
  //   resolved: storyMediaProviderFactory({ includeUserAuthProvider: true }),
  //   pending: pendingPromise,
  //   rejected: rejectedPromise,
  //   'view only': storyMediaProviderFactory({ includeUploadContext: false }),
  //   'w/o link cards': storyMediaProviderFactory({
  //     includeLinkCreateContext: false,
  //   }),
  //   'w/o userAuthProvider': storyMediaProviderFactory(),
  //   undefined: undefined,
  // },
  // activityProvider: {
  //   resolved: new MockActivityResource(),
  //   pending: pendingPromise,
  //   rejected: rejectedPromise,
  //   undefined: undefined,
  // },
  // imageUploadProvider: {
  //   resolved: Promise.resolve(imageUploadHandler),
  //   pending: pendingPromise,
  //   rejected: rejectedPromise,
  //   undefined: undefined,
  // },
};
