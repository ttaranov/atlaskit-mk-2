import * as React from 'react';
import { Context } from '@atlaskit/media-core';
import { Identifier, ItemSource, MediaViewerFeatureFlags } from './domain';
import { List } from './list';
import { Collection } from './collection';
import { Content } from './content';
import { Blanket } from './styled';
import { Shortcut } from './shortcut';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

export type Props = Readonly<{
  onClose?: () => void;
  selectedItem?: Identifier;
  featureFlags?: MediaViewerFeatureFlags;
  context: Context;
  itemSource: ItemSource;
}>;

export class MediaViewer extends React.Component<Props, {}> {
  render() {
    const { onClose } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Blanket>
          {onClose && <Shortcut keyCode={27} handler={onClose} />}
          <Content onClose={onClose}>{this.renderContent()}</Content>
        </Blanket>
      </ThemeProvider>
    );
  }

  private renderContent() {
    const {
      selectedItem,
      context,
      onClose,
      itemSource,
      featureFlags,
    } = this.props;
    if (itemSource.kind === 'COLLECTION') {
      return (
        <Collection
          pageSize={itemSource.pageSize}
          defaultSelectedItem={selectedItem}
          collectionName={itemSource.collectionName}
          context={context}
          onClose={onClose}
          featureFlags={featureFlags}
        />
      );
    } else if (itemSource.kind === 'ARRAY') {
      return (
        <List
          defaultSelectedItem={selectedItem || itemSource.items[0]}
          items={itemSource.items}
          context={context}
          onClose={onClose}
          featureFlags={featureFlags}
        />
      );
    } else {
      return null as never;
    }
  }
}
