import * as React from 'react';
import {
  LinkWrapper,
  Wrapper,
  Header,
  IconWrapper,
  TextWrapper,
  Content,
} from './styled';

export interface CardFrameProps {
  href?: string;
  icon?: React.ReactNode;
  text?: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  children?: React.ReactNode;
}

export default class CardFrame extends React.Component<CardFrameProps> {
  renderHeader() {
    const { icon, text } = this.props;
    return (
      <Header>
        <IconWrapper>{icon}</IconWrapper>
        <TextWrapper>{text}</TextWrapper>
      </Header>
    );
  }

  renderContent() {
    const { children } = this.props;
    return <Content>{children}</Content>;
  }

  render() {
    const { href, minWidth, maxWidth } = this.props;
    if (href) {
      return (
        <LinkWrapper
          target="_blank"
          rel="noopener"
          className="media-card-link"
          href={href}
          minWidth={minWidth}
          maxWidth={maxWidth}
        >
          {this.renderHeader()}
          {this.renderContent()}
        </LinkWrapper>
      );
    } else {
      return (
        <Wrapper minWidth={minWidth} maxWidth={maxWidth}>
          {this.renderHeader()}
          {this.renderContent()}
        </Wrapper>
      );
    }
  }
}
