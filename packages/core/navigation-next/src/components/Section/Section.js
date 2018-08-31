// @flow

import React, { PureComponent } from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import { css as parseJss } from 'emotion';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import { transitionDurationMs } from '../../common/constants';
import getAnimationStyles from './getAnimationStyles';
import type { SectionProps, SectionState } from './types';

const StaticWrapper = props => (
  <div className={parseJss({ position: 'relative' })} {...props} />
);

const GrowingWrapper = props => (
  <div
    className={parseJss({
      position: 'relative',
      flex: '1 1 100%',
      overflowY: 'hidden',
    })}
    {...props}
  />
);

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
    const {
      alwaysShowScrollHint,
      id,
      children,
      shouldGrow,
      styles: styleReducer,
      theme,
    } = this.props;

    const { mode, context } = theme;
    const styles = styleReducer(
      mode.section({ alwaysShowScrollHint })[context],
    );

    return (
      <TransitionGroup component={shouldGrow ? GrowingWrapper : StaticWrapper}>
        <Transition key={id} timeout={transitionDurationMs}>
          {state => {
            const { traversalDirection } = this.state;
            const animationStyles = getAnimationStyles({
              state,
              traversalDirection,
            });
            const className = parseJss(styles.children);

            // We provide both the styles object and the computed className.
            // This allows consumers to patch the styles if they want to, or
            // simply apply the className if they're not using a JSS parser like
            // emotion.
            const resolvedChildren = children({
              className,
              css: styles.children,
            });

            return (
              <NavigationAnalyticsContext
                data={{
                  attributes: { viewSection: id },
                  componentName: 'Section',
                }}
              >
                {shouldGrow ? (
                  <div
                    className={parseJss({
                      ...styles.wrapper,
                      ...animationStyles,
                    })}
                  >
                    <div className={parseJss(styles.inner)}>
                      {resolvedChildren}
                    </div>
                  </div>
                ) : (
                  <div className={parseJss(animationStyles)}>
                    {resolvedChildren}
                  </div>
                )}
              </NavigationAnalyticsContext>
            );
          }}
        </Transition>
      </TransitionGroup>
    );
  }
}
