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
  render() {
    const { href, icon, text, minWidth, maxWidth, children } = this.props;
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
          <Header>
            <IconWrapper>{icon}</IconWrapper>
            <TextWrapper>{text}</TextWrapper>
          </Header>
          <Content>{children}</Content>
        </LinkWrapper>
      );
    } else {
      return (
        <Wrapper minWidth={minWidth} maxWidth={maxWidth}>
          <Header>
            <IconWrapper>{icon}</IconWrapper>
            <TextWrapper>{text}</TextWrapper>
          </Header>
          <Content>{children}</Content>
        </Wrapper>
      );
    }
  }
}
