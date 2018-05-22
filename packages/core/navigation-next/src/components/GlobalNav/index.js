// @flow

/**
 * NOTE: 'GlobalNav' is the layout primitive, which will be wrapped by the more
 * opinionated 'GlobalNavigation' component.
 */

import React from 'react';
import GlobalItem from '../GlobalItem';

import { light, withTheme } from '../../theme';
import {
  FirstPrimaryItemWrapper,
  PrimaryItemsList,
  SecondaryItemsList,
} from './primitives';
import type { GlobalNavProps } from './types';

const GlobalNav = ({
  children, // drawers
  primaryItems,
  secondaryItems,
  theme,
}: GlobalNavProps) => {
  const wrapperStyles = theme.mode.globalNav();

  return (
    <div css={wrapperStyles}>
      <PrimaryItemsList>
        {primaryItems.map((props, index) => {
          // Render the first item with a margin beneath it and a large icon
          if (!index) {
            const { icon: Icon, ...rest } = props;
            return (
              <FirstPrimaryItemWrapper key={props.key || props.label}>
                <GlobalItem
                  {...rest}
                  icon={provided => <Icon {...provided} size="large" />}
                  size="large"
                />
              </FirstPrimaryItemWrapper>
            );
          }
          return (
            <GlobalItem
              {...props}
              key={props.key || props.label}
              size="large"
            />
          );
        })}
      </PrimaryItemsList>

      <SecondaryItemsList>
        {secondaryItems.map(props => (
          <GlobalItem {...props} key={props.label} size="small" />
        ))}
      </SecondaryItemsList>

      {children}
    </div>
  );
};

export default withTheme({ mode: light, context: 'expanded' })(GlobalNav);
