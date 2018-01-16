import * as React from 'react';
import { Component } from 'react';
import { Node as PmNode } from 'prosemirror-model';
import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';
import { MacroProvider } from '../../../editor/plugins/macro';
import { getPlaceholderUrl } from '@atlaskit/editor-common';
import { Header, Content, ContentWrapper } from './styles';
import {
  Wrapper,
  Overlay,
  PlaceholderFallback,
  PlaceholderFallbackParams,
} from '../styles';
import { capitalizeFirstLetter } from '../utils';

export interface Props {
  node: PmNode;
  macroProvider?: MacroProvider;
  onClick: (event: React.SyntheticEvent<any>) => void;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  onSelectExtension: () => void;
}

export default class Extension extends Component<Props, any> {
  render() {
    const {
      node,
      onClick,
      handleContentDOMRef,
      onSelectExtension,
    } = this.props;
    const { extensionKey } = node.attrs;

    const placeholderUrl = getPlaceholderUrl({ node, type: 'image' });
    const placeholderFallbackUrl = getPlaceholderUrl({ node, type: 'icon' });

    const hasBody = node.type.name === 'bodiedExtension';

    return (
      <Wrapper onClick={onClick} className={hasBody ? '' : 'with-overlay'}>
        <Overlay className="extension-overlay" />
        <Header contentEditable={false} onClick={onSelectExtension}>
          {placeholderUrl ? (
            <img src={placeholderUrl} alt={extensionKey} />
          ) : (
            this.renderPlaceholderFallback(placeholderFallbackUrl)
          )}
        </Header>
        {hasBody && (
          <ContentWrapper>
            <Content
              innerRef={handleContentDOMRef}
              className="extension-content"
            />
          </ContentWrapper>
        )}
      </Wrapper>
    );
  }

  private renderPlaceholderFallback = (placeholderUrl?: string) => {
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
