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
  isPlaceholder?: boolean;
  href?: string;
  icon?: React.ReactElement<any>;
  text?: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  children?: React.ReactNode;
}

export default class CardFrame extends React.Component<CardFrameProps> {
  renderHeader() {
    const { isPlaceholder = false, icon, text } = this.props;
    return (
      <Header>
        <IconWrapper isPlaceholder={isPlaceholder}>
          {!isPlaceholder && icon}
        </IconWrapper>
        <TextWrapper isPlaceholder={isPlaceholder}>
          {!isPlaceholder && text}
        </TextWrapper>
      </Header>
    );
  }

  renderContent() {
    const { children } = this.props;
    return <Content>{children}</Content>;
  }

  render() {
    const { isPlaceholder, href, minWidth, maxWidth } = this.props;
    if (!isPlaceholder && href) {
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
