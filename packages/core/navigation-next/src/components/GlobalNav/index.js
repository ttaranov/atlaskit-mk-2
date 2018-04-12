// @flow

/**
 * NOTE: 'GlobalNav' is the layout primitive, which will be wrapped by the more
 * opinionated 'GlobalNavigation' component.
 */

import React, { Component } from 'react';
import { gridSize } from '@atlaskit/theme';

import GlobalItem from '../GlobalItem';
import type { GlobalNavProps } from './types';
import { light, withTheme } from '../../theme';

export { GLOBAL_NAV_WIDTH } from './styles';

const listBaseStyles = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingTop: `${gridSize()}px`,
  width: `${gridSize() * 5}px`,
};

const PrimaryItemsList = props => (
  <div
    css={{ ...listBaseStyles, paddingBottom: `${gridSize() * 2}px` }}
    {...props}
  />
);

const SecondaryItemsList = props => (
  <div
    css={{ ...listBaseStyles, paddingBottom: `${gridSize()}px` }}
    {...props}
  />
);

class GlobalNav extends Component<GlobalNavProps> {
  static defaultProps = {
    theme: { mode: light, context: 'expanded' },
  };

  render() {
    const {
      children, // drawers
      primaryActions,
      secondaryActions,
      theme,
    } = this.props;

    const wrapperStyles = theme.mode.globalNav()[theme.context];

    return (
      <div css={wrapperStyles}>
        <PrimaryItemsList>
          {primaryActions.map((props, index) => (
            <GlobalItem
              {...props}
              isFirst={!index}
              key={props.key || props.label}
              size="large"
            />
          ))}
        </PrimaryItemsList>

        <SecondaryItemsList>
          {secondaryActions.map(props => (
            <GlobalItem {...props} key={props.label} size="small" />
          ))}
        </SecondaryItemsList>

        {children}
      </div>
    );
  }
}

export default withTheme(GlobalNav);
