import * as React from 'react';
import { Component } from 'react';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { MacroProvider } from '../../../../macro';
import { Wrapper, Header, Content, ContentWrapper } from './styles';
import { Overlay } from '../styles';
import ExtensionLozenge from '../Lozenge';
import { pluginKey as widthPluginKey } from '../../../../width';
import { calcExtensionWidth } from '@atlaskit/editor-common';
import WithPluginState from '../../../../../ui/WithPluginState';

export interface Props {
  node: PmNode;
  macroProvider?: MacroProvider;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  onSelectExtension: (hasBody) => void;
  children?: React.ReactNode;
  view: EditorView;
}

export default class Extension extends Component<Props, any> {
  private onSelectExtension = () => {
    const { onSelectExtension, node } = this.props;
    onSelectExtension(node.type.name === 'bodiedExtension');
  };

  render() {
    const { node, handleContentDOMRef, children, view } = this.props;

    const hasBody = node.type.name === 'bodiedExtension';
    const hasChildren = !!children;

    return (
      <WithPluginState
        editorView={view}
        plugins={{
          width: widthPluginKey,
        }}
        render={({ width }) => {
          return (
            <Wrapper
              data-layout={node.attrs.layout}
              className={`extension-container ${hasBody ? '' : 'with-overlay'}`}
              style={{
                width: calcExtensionWidth(node.attrs.layout, width),
              }}
            >
              <Overlay className="extension-overlay" />
              <Header
                contentEditable={false}
                className={hasChildren ? 'with-children' : ''}
                onClick={this.onSelectExtension}
              >
                {children ? children : <ExtensionLozenge node={node} />}
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
        }}
      />
    );
  }
}
