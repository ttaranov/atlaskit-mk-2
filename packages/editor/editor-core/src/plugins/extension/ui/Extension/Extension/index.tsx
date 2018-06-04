import * as React from 'react';
import { Component } from 'react';
import { Node as PmNode } from 'prosemirror-model';
import { MacroProvider } from '../../../../macro';
import { Wrapper, Header, Content, ContentWrapper } from './styles';
import { Overlay } from '../styles';
import ExtensionLozenge from '../Lozenge';

export interface Props {
  node: PmNode;
  macroProvider?: MacroProvider;
  onClick: (event: React.SyntheticEvent<any>) => void;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  onSelectExtension: () => void;
  children?: React.ReactNode;
}

export default class Extension extends Component<Props, any> {
  render() {
    const {
      node,
      onClick,
      handleContentDOMRef,
      onSelectExtension,
      children,
    } = this.props;

    const hasBody = node.type.name === 'bodiedExtension';
    const hasChildren = !!children;

    return (
      <Wrapper
        onClick={onClick}
        className={`extension-container ${hasBody ? '' : 'with-overlay'}`}
      >
        <Overlay className="extension-overlay" />
        <Header
          contentEditable={false}
          onClick={onSelectExtension}
          className={hasChildren ? 'with-children' : ''}
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
  }
}
