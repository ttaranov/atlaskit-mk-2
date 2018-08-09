import * as React from 'react';
import { Component } from 'react';
import { PublicGridItem, MediaGrid } from '@atlaskit/media-filmstrip';
import { WithProviders, ProviderFactory } from '@atlaskit/editor-common';
import { Node } from 'prosemirror-model';
import { MediaProvider } from '../../ui/MediaCard';
import { Context } from '@atlaskit/media-core';

export interface MediaGridNodeProps {
  node: Node;
  providers: ProviderFactory;
}

export class MediaGridNode extends Component<MediaGridNodeProps> {
  render() {
    const { node, providers } = this.props;
    const items: PublicGridItem[] = node.content.content.map(file => {
      const { id, collection, width, height } = file.attrs;

      return {
        id,
        collectionName: collection,
        dimensions: {
          width,
          height,
        },
      };
    });

    return (
      <WithProviders
        providers={['mediaProvider']}
        providerFactory={providers}
        renderNode={(providers: { mediaProvider?: MediaProvider } = {}) => {
          const { mediaProvider } = providers;
          const context = new Promise<Context>(async resolve => {
            const context = mediaProvider && (await mediaProvider).viewContext;

            resolve(context);
          });

          return (
            <MediaGrid items={items} context={context} isInteractive={false} />
          );
        }}
      />
    );
  }
}
