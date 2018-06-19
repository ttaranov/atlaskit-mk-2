import * as React from 'react';
import styled from 'styled-components';

const Link = styled.a`
  cursor: pointer;
  margin: 2px;
`;

export interface LinkViewProps {
  text: string;
  onClick?: () => void;
}

export class LinkView extends React.Component<LinkViewProps> {
  handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  };

  render() {
    const { text } = this.props;
    return <Link onClick={this.handleClick}>{text}</Link>;
  }
}
