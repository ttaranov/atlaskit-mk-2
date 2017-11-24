import * as React from 'react';
import { Component } from 'react';
import { Node as PmNode } from 'prosemirror-model';
import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';
import {
  MacroProvider,
  getPlaceholderUrl,
} from '../../../editor/plugins/macro';
import {
  Wrapper,
  Header,
  Placeholder,
  PlaceholderFallback,
  PlaceholderFallbackParams,
  Content,
} from './styles';
import { capitalizeFirstLetter } from '../utils';

export interface Props {
  node: PmNode;
  macroProvider?: MacroProvider;
  onClick: (event: React.SyntheticEvent<any>) => void;
  onSelectExtension: () => void;
  handleContentDOMRef: (node: HTMLElement | null) => void;
}

export default class Extension extends Component<Props, any> {
  render() {
    const {
      node,
      onClick,
      onSelectExtension,
      handleContentDOMRef,
    } = this.props;
    const { extensionKey } = node.attrs;

    // TODO: handle other extension types to get "placeholderUrl"
    let placeholderUrl;
    let placeholderFallbackUrl;

    // if (macroProvider) {
    //   const { config: { placeholderBaseUrl } } = macroProvider;
    //   const imageUrl = getPlaceholderUrl({ node, type: 'image' });
    //   const iconUrl = getPlaceholderUrl({ node, type: 'icon' });
    //   placeholderUrl = imageUrl ? `${placeholderBaseUrl}${imageUrl}` : null;
    //   placeholderFallbackUrl = iconUrl
    //     ? `${placeholderBaseUrl}${iconUrl}`
    //     : null;
    // }

    return (
      <Wrapper onClick={onClick}>
        <Header onClick={onSelectExtension}>
          {placeholderUrl ? (
            <img src={placeholderUrl} alt={extensionKey} />
          ) : (
            this.renderPlaceholderFallback(placeholderFallbackUrl)
          )}
        </Header>
        {node.attrs.bodyType !== 'none' && (
          <Content innerRef={handleContentDOMRef} />
        )}
      </Wrapper>
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
