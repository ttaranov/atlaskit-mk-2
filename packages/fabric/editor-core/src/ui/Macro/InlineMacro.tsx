import * as React from 'react';
import { Component } from 'react';
import { Node as PmNode } from 'prosemirror-model';
import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';
import { MacroProvider } from '../../editor/plugins/macro/types';
import {
  Placeholder,
  Overlay,
  PlaceholderFallback,
  PlaceholderFallbackParams,
} from './styles';

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export interface Props {
  node: PmNode;
  macroProvider: MacroProvider;
  onClick: (event: React.SyntheticEvent<any>) => void;
  getPlaceholderUrl: (
    params: { node: PmNode; type: 'icon' | 'image' },
  ) => string | undefined;
  getMacroId: (node: PmNode) => string | undefined;
}

export default class InlineMacro extends Component<Props, any> {
  render() {
    const { node, getMacroId, onClick, getPlaceholderUrl } = this.props;
    const placeholderImageUrl = getPlaceholderUrl({ node, type: 'image' });

    return (
      <Placeholder data-macro-id={getMacroId(node)} onClick={onClick}>
        <Overlay />
        {placeholderImageUrl
          ? this.renderPlaceholderImage(placeholderImageUrl)
          : this.renderPlaceholderFallback()}
      </Placeholder>
    );
  }

  private renderPlaceholderImage = (placeholderUrl: string) => {
    const { macroProvider, node: { attrs: { extensionKey } } } = this.props;

    return (
      <img
        src={`${macroProvider.config.placeholderBaseUrl}${placeholderUrl}`}
        alt={extensionKey}
      />
    );
  };

  private renderPlaceholderFallback = () => {
    const { macroProvider, node, getPlaceholderUrl } = this.props;
    const { parameters, extensionKey } = node.attrs;
    const macroParams = parameters ? parameters.macroParams : {};
    const placeholderUrl = getPlaceholderUrl({ node, type: 'icon' });

    return (
      <PlaceholderFallback>
        {placeholderUrl ? (
          <img
            src={`${macroProvider.config.placeholderBaseUrl}${placeholderUrl}`}
            alt={extensionKey}
          />
        ) : (
          <EditorFileIcon label={extensionKey} />
        )}
        {capitalizeFirstLetter(extensionKey)}
        <PlaceholderFallbackParams>
          {Object.keys(macroParams).map(
            key => ` | ${key} = ${macroParams[key].value}`,
          )}
        </PlaceholderFallbackParams>
      </PlaceholderFallback>
    );
  };
}
