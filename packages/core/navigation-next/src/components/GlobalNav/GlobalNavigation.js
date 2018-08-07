// @flow

/**
 * NOTE: 'GlobalNav' is the layout primitive, which will be wrapped by the more
 * opinionated 'GlobalNavigation' component.
 */

import React, { Component, Fragment } from 'react';
import { AnalyticsContext } from '@atlaskit/analytics-next';
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
      <AnalyticsContext
        data={{
          attributes: { navigationLayer: 'global' },
          componentName: 'globalNav',
        }}
      >
        <div css={wrapperStyles}>
          {/* TODO: Find a way to conditionally add this to context. We don't want it on non-nav events fired, e.g. tooltip? */}
          <PrimaryItemsList>
            <AnalyticsContext
              data={{ attributes: { navigationIconGrouping: 'primary' } }}
            >
              <Fragment>
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
                          index={index}
                        />
                      </FirstPrimaryItemWrapper>
                    );
                  }
                  return (
                    <GlobalItem
                      {...props}
                      key={props.key || props.label}
                      size="large"
                      index={index}
                    />
                  );
                })}
              </Fragment>
            </AnalyticsContext>
          </PrimaryItemsList>

          <SecondaryItemsList>
            <AnalyticsContext
              data={{ attributes: { navigationIconGrouping: 'secondary' } }}
            >
              <Fragment>
                {secondaryItems.map((props, index) => (
                  <GlobalItem
                    {...props}
                    key={props.label}
                    size="small"
                    index={index}
                  />
                ))}
              </Fragment>
            </AnalyticsContext>
          </SecondaryItemsList>
        </div>
      </AnalyticsContext>
    );
  }
}
