// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavItemLink = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  color: #36c;

  &:hover {
    background: #ddd;
    cursor: pointer;
  }
`;

export type NavItemProps = {
  to: string,
  children: Node,
};

export default class NavItem extends React.PureComponent<NavItemProps> {
  props: NavItemProps;
  render() {
    return (
      <NavItemLink to={this.props.to}>
        {this.props.children}
      </NavItemLink>
    );
  }
}
