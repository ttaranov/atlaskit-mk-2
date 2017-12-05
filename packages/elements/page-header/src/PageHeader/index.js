// @flow
import React, { Component, type Element, type Node } from 'react';

import {
  Outer,
  TitleWrapper,
  Title,
  ActionsWrapper,
  BottomBarWrapper,
  BreadcrumbsContainer,
} from './styled';

type Props = {
  /** Page breadcrumbs to be rendered above the title. */
  breadcrumbs?: Element<any>,
  /** Contents of the action bar to be rendere\d next to the page title. */
  actions?: Element<any>,
  /** Contents of the header bar to be rendered below the page title. */
  bottomBar?: Element<any>,
  /** Content of the page title. The text would be trimmed if it doesn't fit the
   header width and end with an ellipsis */
  children?: Node,
};

export default class PageHeader extends Component<Props> {
  render() {
    const { breadcrumbs, actions, bottomBar, children } = this.props;

    return (
      <Outer>
        {breadcrumbs && (
          <BreadcrumbsContainer> {breadcrumbs} </BreadcrumbsContainer>
        )}
        <TitleWrapper>
          <Title>{children}</Title>
          <ActionsWrapper>{actions}</ActionsWrapper>
        </TitleWrapper>
        {bottomBar && <BottomBarWrapper> {bottomBar} </BottomBarWrapper>}
      </Outer>
    );
  }
}
