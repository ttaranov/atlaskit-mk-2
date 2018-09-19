import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';

import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../example-helpers/grid-document';

const mediaProvider = storyMediaProviderFactory({
  includeUserAuthProvider: true,
});

export default function Example() {
  return FullPageExample({
    defaultValue: exampleDocument,
    UNSAFE_mediaSingle_grid: true,
    media: {
      provider: mediaProvider,
      allowMediaSingle: true,
      UNSAFE_allowMediaSingleResizing: true,
    },
  });
}
