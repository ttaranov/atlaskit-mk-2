import * as React from 'react';
import { Component } from 'react';
import { Node as PmNode } from 'prosemirror-model';
import { MacroProvider } from '../../../editor/plugins/macro';
import { Wrapper, Header, Content, ContentWrapper } from './styles';
import { Overlay } from '../styles';
import ExtensionLozenge from '../Lozenge';

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

    const hasBody = node.type.name === 'bodiedExtension';

    return (
      <Wrapper onClick={onClick} className={hasBody ? '' : 'with-overlay'}>
        <Overlay className="extension-overlay" />
        <Header contentEditable={false} onClick={onSelectExtension}>
          <ExtensionLozenge node={node} />
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
}
