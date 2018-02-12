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
  /** Enable default styled wrapper for page title */
  useStyledWrapper?: boolean,
};
export default class PageHeader extends Component<Props> {
  render() {
    const {
      breadcrumbs,
      actions,
      bottomBar,
      children,
      useStyledWrapper = true,
    } = this.props;

    return (
      <Outer>
        {breadcrumbs && (
          <BreadcrumbsContainer> {breadcrumbs} </BreadcrumbsContainer>
        )}
        <TitleWrapper>
          {useStyledWrapper ? <Title>{children}</Title> : children}
          <ActionsWrapper>{actions}</ActionsWrapper>
        </TitleWrapper>
        {bottomBar && <BottomBarWrapper> {bottomBar} </BottomBarWrapper>}
      </Outer>
    );
  }
}
