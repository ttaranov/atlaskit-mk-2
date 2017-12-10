import {
  ContextIdentifier,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common';

export function storyContextIdentifierProviderFactory(
  contextIdentifierProviderFactoryConfig: ContextIdentifier = {
    containerId: 'DUMMY-CONTAINER-ID',
    objectId: 'DUMMY-OBJECT-ID',
  },
) {
  return Promise.resolve<ContextIdentifierProvider>({
    getContext: () => contextIdentifierProviderFactoryConfig,
  });
}
