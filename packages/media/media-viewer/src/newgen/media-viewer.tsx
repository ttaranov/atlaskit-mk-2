import * as React from 'react';
import { Context } from '@atlaskit/media-core';
import { Identifier, ItemSource, MediaViewerFeatureFlags } from './domain';
import { List } from './list';
import { Collection } from './collection';
import { Content } from './content';
import { Blanket, Widget, WidgetControls } from './styled';
import { Shortcut } from './shortcut';
import { ItemViewer } from './item-viewer';
import Button from '@atlaskit/button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import VidShareScreenIcon from '@atlaskit/icon/glyph/vid-share-screen';

export type Props = {
  onClose?: () => void;
  selectedItem?: Identifier;
  readonly featureFlags?: MediaViewerFeatureFlags;
  context: Context;
  itemSource: ItemSource;
};

export type State = {
  widgetMode: boolean;
};

export class MediaViewer extends React.Component<Props, State> {
  state: State = { widgetMode: false };

  render() {
    const { onClose, context, selectedItem, featureFlags } = this.props;

    if (selectedItem && this.state.widgetMode) {
      return (
        <Widget>
          <WidgetControls>
            <Button
              onClick={this.onCloseWidget}
              iconBefore={<VidShareScreenIcon label="Maximise player" />}
            />
            <Button
              onClick={onClose}
              iconBefore={<CrossIcon label="Close" />}
            />
          </WidgetControls>
          {onClose && <Shortcut keyCode={27} handler={onClose} />}
          <ItemViewer
            featureFlags={featureFlags}
            context={context}
            identifier={selectedItem}
          />
        </Widget>
      );
    }
    return (
      <Blanket>
        {onClose && <Shortcut keyCode={27} handler={onClose} />}
        <Content onClose={onClose}>{this.renderContent()}</Content>
      </Blanket>
    );
  }

  private onCloseWidget = () => {
    this.setState({ widgetMode: false });
  };

  private onWidget = () => {
    this.setState({ widgetMode: true });
  };

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
          selectedItem={selectedItem}
          collectionName={itemSource.collectionName}
          context={context}
          onClose={onClose}
          onWidget={this.onWidget}
          featureFlags={featureFlags}
        />
      );
    } else if (itemSource.kind === 'ARRAY') {
      return (
        <List
          selectedItem={selectedItem || itemSource.items[0]}
          items={itemSource.items}
          context={context}
          onClose={onClose}
          onWidget={this.onWidget}
          featureFlags={featureFlags}
        />
      );
    } else {
      return null as never;
    }
  }
}
