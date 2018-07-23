// @flow

/**
 * NOTE: 'GlobalNav' is the layout primitive, which will be wrapped by the more
 * opinionated 'GlobalNavigation' component.
 */

import React, { Component } from 'react';
import GlobalItem from '../GlobalItem';

import {
  FirstPrimaryItemWrapper,
  PrimaryItemsList,
  SecondaryItemsList,
} from './primitives';
import type { GlobalNavigationProps } from './types';

export default class GlobalNavigation extends Component<GlobalNavigationProps> {
  render() {
    const { primaryItems, secondaryItems, theme } = this.props;
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
      </div>
    );
  }
}
