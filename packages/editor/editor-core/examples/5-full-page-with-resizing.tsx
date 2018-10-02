import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';

import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../example-helpers/grid-document';

const mediaProvider = storyMediaProviderFactory({
  includeUserAuthProvider: true,
});

export default function Example() {
  return FullPageExample({
    defaultValue: exampleDocument,
    media: {
      provider: mediaProvider,
      allowMediaSingle: true,
      allowResizing: true,
    },
    allowDynamicTextSizing: true,
  });
}
