// @flow
import * as React from 'react';
import styled from 'styled-components';
import Navigation, { AkNavigationItemGroup, AkNavigationItem, AkContainerTitle } from '@atlaskit/navigation';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';

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
      <Navigation
        globalPrimaryIcon={<AtlassianIcon size="xlarge" label="AtlasKit" />}
        globalPrimaryItemHref="/"
        containerHeaderComponent={() => <AkContainerTitle icon={<AtlassianIcon label="AtlasKit" />} text={this.props.title} />}
      >
        {this.props.children}
      </Navigation>
    );
  }
}
