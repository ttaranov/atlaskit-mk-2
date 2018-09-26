// @flow
import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import React, { Fragment, PureComponent } from 'react';
import type { Element, Node } from 'react';
import AnimateHeight from 'react-animate-height';

import * as styles from './styledPanel';
import Expandable from '../Expandable';

type Props = {
  /** Content to be shown inside the panel. */
  children?: Node,
  /** Header to render on the panel. Clicking the header expands and collapses the panel */
  header?: Element<any>,
  /** Defines whether the panel is expanded by default. */
  isDefaultExpanded?: boolean,
};

type State = {
  hasFinishedAnimating: boolean,
  isFocused: boolean,
};

export default class Panel extends PureComponent<Props, State> {
  static defaultProps = {
    isDefaultExpanded: false,
  };

  state = {
    hasFinishedAnimating: true,
    isFocused: false,
  };

  onRest = () => {
    this.setState({ hasFinishedAnimating: true });
  };

  togglePanel = () => {
    this.setState({ hasFinishedAnimating: false });
  };

  render() {
    const { isDefaultExpanded, children, header } = this.props;

    return (
      <Expandable defaultIsExpanded={isDefaultExpanded}>
        {({ isExpanded, toggleExpanded }) => (
          <Fragment>
            <styles.PanelHeader
              hasFocus={this.state.isFocused}
              onClick={() => {
                this.togglePanel();
                toggleExpanded();
              }}
              onFocus={() => this.setState({ isFocused: true })}
              onBlur={() => this.setState({ isFocused: false })}
            >
              <styles.ButtonWrapper isHidden={isExpanded}>
                <Button
                  appearance="subtle"
                  ariaExpanded={isExpanded}
                  spacing="none"
                  iconBefore={
                    isExpanded ? (
                      <ChevronDownIcon label="collapse" />
                    ) : (
                      <ChevronRightIcon label="expand" />
                    )
                  }
                />
              </styles.ButtonWrapper>
              <span>{header}</span>
            </styles.PanelHeader>

            <AnimateHeight
              duration={200}
              easing="linear"
              height={isExpanded ? 'auto' : 0}
              onAnimationEnd={this.onRest}
            >
              {children}
            </AnimateHeight>
          </Fragment>
        )}
      </Expandable>
    );
  }
}
