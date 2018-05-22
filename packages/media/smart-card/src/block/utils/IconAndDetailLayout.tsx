import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  min-width: 0; /* for Chrome ellipsis */
  flex-basis: 0; /* for IE ellipsis */
  margin: 8px 12px 12px 0;
`;

const Left = styled.div`
  flex-shrink: 0;
  margin-top: 4px;
  margin-left: 12px;
`;

const Right = styled.div`
  flex-grow: 1;
  min-width: 0; /* for Chrome ellipsis */
  flex-basis: 0; /* for IE ellipsis */
  margin-left: 12px;
`;

export interface IconAndDetailLayoutProps {
  left?: React.ReactNode;
  right: React.ReactNode;
}

export class IconAndDetailLayout extends React.Component<
  IconAndDetailLayoutProps
> {
  render() {
    const { left, right } = this.props;
    return (
      <Wrapper>
        {left && <Left>{left}</Left>}
        <Right>{right}</Right>
      </Wrapper>
    );
  }
}
