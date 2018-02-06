import * as React from 'react';
import { Component } from 'react';
import { Node as PmNode } from 'prosemirror-model';
import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';
import { getPlaceholderData } from '@atlaskit/editor-common';
import { PlaceholderFallback, PlaceholderFallbackParams } from './styles';
import { capitalizeFirstLetter } from './utils';

export interface Props {
  node: PmNode;
}

interface PlaceholderData {
  url: string;
  height?: number;
  width?: number;
}

const ICON_SIZE = 24;

export default class Placeholder extends Component<Props, any> {
  render() {
    const { node } = this.props;

    // TODO: handle other extension types to get "placeholderUrl"
    const placeholderImageData = getPlaceholderData({ node, type: 'image' });
    const placeholderIconData = getPlaceholderData({ node, type: 'icon' });

    if (placeholderImageData) {
      return this.renderPlaceholder(placeholderImageData);
    }

    return this.renderPlaceholderFallback(placeholderIconData);
  }

  private renderPlaceholder(placeholderData: PlaceholderData) {
    const { extensionKey } = this.props.node.attrs;
    const { url, ...rest } = placeholderData;
    return <img src={url} {...rest} alt={extensionKey} />;
  }

  private renderPlaceholderFallback = (placeholderData?: PlaceholderData) => {
    const { parameters, extensionKey } = this.props.node.attrs;
    const params = parameters && parameters.macroParams;

    return (
      <PlaceholderFallback>
        {placeholderData ? (
          this.renderPlaceholder({
            height: ICON_SIZE,
            width: ICON_SIZE,
            ...placeholderData,
          })
        ) : (
          <EditorFileIcon label={extensionKey} />
        )}
        {capitalizeFirstLetter(extensionKey)}
        {params && (
          <PlaceholderFallbackParams>
            {Object.keys(params).map(key => ` | ${key} = ${params[key].value}`)}
          </PlaceholderFallbackParams>
        )}
      </PlaceholderFallback>
    );
  };
}
