// @flow

import React, { PureComponent, Fragment } from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import { css as parseJss } from 'emotion';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import { transitionDurationMs } from '../../common/constants';
import { getSectionWrapperStyles } from './styles';
import type { SectionProps, SectionState } from './types';

export default class Section extends PureComponent<SectionProps, SectionState> {
  state = {
    traversalDirection: null,
  };

  componentWillReceiveProps(nextProps: SectionProps) {
    if (nextProps.parentId && nextProps.parentId === this.props.id) {
      this.setState({ traversalDirection: 'down' });
    }
    if (this.props.parentId && this.props.parentId === nextProps.id) {
      this.setState({ traversalDirection: 'up' });
    }
  }

  render() {
    const { id, children, disableTransition } = this.props;
    const transitionTimeout = disableTransition ? 0 : transitionDurationMs;
    console.log('Section render', this.props);
    return (
      <TransitionGroup component={Fragment}>
        <Transition key={id} timeout={transitionTimeout}>
          {state => {
            console.log('Section Transition render', state, this.state);
            // debugger; // eslint-disable-line
            const { traversalDirection } = this.state;
            const css = getSectionWrapperStyles({ state, traversalDirection });
            const className = parseJss(css);

            // We provide both the styles object and the computed className.
            // This allows consumers to patch the styles if they want to, or
            // simply apply the className if they're not using a JSS parser like
            // emotion.
            return (
              <NavigationAnalyticsContext
                data={{
                  attributes: { viewSection: id },
                  componentName: 'Section',
                }}
              >
                {children({ className, css })}
              </NavigationAnalyticsContext>
            );
          }}
        </Transition>
      </TransitionGroup>
    );
  }
}
