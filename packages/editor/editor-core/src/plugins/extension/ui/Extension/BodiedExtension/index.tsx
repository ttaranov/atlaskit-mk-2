import * as React from 'react';
import { Component } from 'react';
import { Node as PmNode } from 'prosemirror-model';
import { Wrapper, Header, Content, ContentWrapper } from './styles';
import { Overlay } from '../styles';
import ExtensionLozenge from '../Lozenge';
import { MacroProvider } from '../../../../macro';

export interface Props {
  node: PmNode;
  onClick: (event: React.SyntheticEvent<any>) => void;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  onSelectExtension: () => void;
  children?: React.ReactNode;
  isFocused?: boolean;
  macroProvider?: MacroProvider;
}

export default class BodiedExtension extends Component<Props, any> {
  render() {
    const {
      node,
      onClick,
      handleContentDOMRef,
      onSelectExtension,
      children,
      isFocused,
    } = this.props;

    const hasChildren = !!children;

    const wrapperClassNames = (hasChildren && 'with-children') || '';
    const contentClassName = isFocused
      ? 'extension-content'
      : 'extension-content hidden';

    return (
      <Wrapper onClick={onClick} className={wrapperClassNames}>
        <Overlay className="extension-overlay" />
        {hasChildren && !isFocused ? (
          children
        ) : (
          <Header contentEditable={false} onClick={onSelectExtension}>
            <ExtensionLozenge node={node} />
          </Header>
        )}
        <ContentWrapper className={contentClassName}>
          <Content innerRef={handleContentDOMRef} />
        </ContentWrapper>
      </Wrapper>
    );
  }
}
