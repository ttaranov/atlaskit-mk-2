import * as React from 'react';
import { Component } from 'react';
import { Node as PmNode } from 'prosemirror-model';
import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';
import {
  MacroProvider,
  getPlaceholderUrl,
} from '../../../editor/plugins/macro';
import {
  Placeholder,
  Overlay,
  PlaceholderFallback,
  PlaceholderFallbackParams,
} from './styles';
import { capitalizeFirstLetter } from '../utils';

export interface Props {
  node: PmNode;
  macroProvider?: MacroProvider;
  onClick: (event: React.SyntheticEvent<any>) => void;
}

export default class InlineExtension extends Component<Props, any> {
  render() {
    const { macroProvider, node, onClick } = this.props;
    const { extensionKey } = node.attrs;

    // TODO: handle other extension types to get "placeholderUrl"
    let placeholderUrl;
    let placeholderFallbackUrl;

    if (macroProvider) {
      const { config: { placeholderBaseUrl } } = macroProvider;
      const imageUrl = getPlaceholderUrl({ node, type: 'image' });
      const iconUrl = getPlaceholderUrl({ node, type: 'icon' });
      placeholderUrl = imageUrl ? `${placeholderBaseUrl}${imageUrl}` : null;
      placeholderFallbackUrl = iconUrl
        ? `${placeholderBaseUrl}${iconUrl}`
        : null;
    }

    return (
      <Placeholder onClick={onClick}>
        <Overlay />
        {placeholderUrl ? (
          <img src={placeholderUrl} alt={extensionKey} />
        ) : (
          this.renderPlaceholderFallback(placeholderFallbackUrl)
        )}
      </Placeholder>
    );
  }

  private renderPlaceholderFallback = (placeholderUrl: string) => {
    const { parameters, extensionKey } = this.props.node.attrs;
    const params =
      parameters && parameters.macroParams ? parameters.macroParams : null;

    return (
      <PlaceholderFallback>
        {placeholderUrl ? (
          <img src={`${placeholderUrl}`} alt={extensionKey} />
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
