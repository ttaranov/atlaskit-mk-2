// @flow
import * as React from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background: #eee;
  padding: 1rem 0;
`;

const NavTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  color: #666;
`;

export type NavProps = {
  title: string,
  children: React.Node,
};

export default class Nav extends React.PureComponent<NavProps> {
  props: NavProps;
  render() {
    return (
      <NavContainer>
        <NavTitle>{this.props.title}</NavTitle>
        {this.props.children}
      </NavContainer>
    );
  }
}
