// @flow
import React, { Component, type Element, type Node } from 'react';

import {
  Outer,
  TitleWrapper,
  Title,
  ActionsWrapper,
  BottomBarWrapper,
  BreadcrumbsContainer,
  CustomComponentWrapper,
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
  /** Disable default styles for page title */
  disableTitleStyles?: boolean,
};
export default class PageHeader extends Component<Props> {
  render() {
    const {
      breadcrumbs,
      actions,
      bottomBar,
      children,
      disableTitleStyles = false,
    } = this.props;
    return (
      <Outer>
        {breadcrumbs && (
          <BreadcrumbsContainer> {breadcrumbs} </BreadcrumbsContainer>
        )}
        <TitleWrapper>
          <CustomComponentWrapper>
            {disableTitleStyles ? children : <Title>{children}</Title>}
          </CustomComponentWrapper>
          <ActionsWrapper>{actions}</ActionsWrapper>
        </TitleWrapper>
        {bottomBar && <BottomBarWrapper> {bottomBar} </BottomBarWrapper>}
      </Outer>
    );
  }
}
