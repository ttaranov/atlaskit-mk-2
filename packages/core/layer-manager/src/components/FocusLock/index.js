// @flow

import React, { Component, type Element as ReactElement } from 'react';
import PropTypes from 'prop-types';
import NewFocusLock from './FocusLock';

type Props = {
  /**
    DOM Element to apply `aria-hidden=true` to when this component gains focus.
    This is provided via context when used within @atlaskit/layer-manager.
  */
  ariaHiddenNode?: HTMLElement,
  /**
    Boolean OR Function indicating which element to focus when the component
    initialises (mounts or becomes enabled):
    - undefined sets the focus on the boundary itself
    - FALSE assumes the user has set autoFocus on another element within the boundary
    - TRUE will automatically find the first "tabbable" element within the boundary
    - Providing a function should return the element you want to focus
  */
  autoFocus?: AutoFocus,
  /**
    Accepts a single child
  */
  children?: ReactElement<*>,
  /**
    Toggle focus management outside of mount/unmount lifecycle methods
  */
  enabled?: boolean,
};

/* eslint-disable react/sort-comp */
export default class FocusLock extends Component<Props> {
  ariaHiddenNode: HTMLElement;
  initFromProps: boolean = false;
  teardownFromProps: boolean = false;
  static contextTypes = {
    /** available when invoked within @atlaskit/layer-manager */
    ariaHiddenNode: PropTypes.object,
  };

  componentDidMount() {
    const { enabled } = this.props;

    if (enabled || enabled === undefined) {
      this.initialise();
    }
  }
  componentWillUnmount() {
    if (!this.initFromProps && !this.teardownFromProps) {
      this.teardown({ shouldRestoreFocus: true });
    }
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.enabled && nextProps.enabled !== this.props.enabled) {
      this.initFromProps = true;
      this.initialise();
    }

    if (!nextProps.enabled && nextProps.enabled !== this.props.enabled) {
      this.teardownFromProps = true;
      this.teardown({ shouldRestoreFocus: true });
    }
  }

  initialise = () => {
    // set the element to hide from assistive technology
    this.ariaHiddenNode =
      this.props.ariaHiddenNode || this.context.ariaHiddenNode;

    // accessible `popup` content
    if (this.ariaHiddenNode) {
      this.ariaHiddenNode.setAttribute('aria-hidden', '');
    }
  };
  teardown = (options: TeardownOptions) => {
    if (this.ariaHiddenNode) {
      this.ariaHiddenNode.removeAttribute('aria-hidden');
    }
  };

  render() {
    const { autoFocus, enabled = false } = this.props;
    const initialFocus =
      typeof autoFocus === 'function' ? autoFocus : undefined;
    return (
      <NewFocusLock enabled={enabled} initialFocus={initialFocus}>
        {this.props.children}
      </NewFocusLock>
    );
  }
}
