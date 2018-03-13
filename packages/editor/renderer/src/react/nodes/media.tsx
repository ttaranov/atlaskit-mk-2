import * as React from 'react';
import { PureComponent } from 'react';
import { WithProviders } from '@atlaskit/editor-common';
import { ProviderFactory } from '@atlaskit/editor-common';
import { MediaCard, MediaCardProps } from '../../ui/MediaCard';

export interface MediaProps extends MediaCardProps {
  providers?: ProviderFactory;
}

export default class Media extends PureComponent<MediaProps, {}> {
  private renderNode = (providers: any) => {
    const { mediaProvider } = providers;

    return <MediaCard mediaProvider={mediaProvider} {...this.props} />;
  };

  render() {
    const { providers } = this.props;

    return (
      <WithProviders
        providers={['mediaProvider']}
        providerFactory={providers!}
        renderNode={this.renderNode}
      />
    );
  }
}
