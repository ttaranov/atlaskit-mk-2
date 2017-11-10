// @flow

import { Children, Component, type Node } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import * as focusScope from '../utils/focus-scope';
import * as focusStore from '../utils/focus-store';

type Props = {
  /**
    DOM Element to apply `aria-hidden=true` to when this component gains focus.
    This is provided via context when used within @atlaskit/layer-manager.
  */
  ariaHiddenNode?: HTMLElement,
  /**
    Boolean OR Function indicating which element to focus when the component mounts
    TRUE will automatically find the first "tabbable" element within the modal
    Providing a function should return the element you want to focus
  */
  autoFocus?: boolean | () => HTMLElement,
  /**
    Inner content
  */
  children?: Node,
  /**
    Toggle focus management outside of mount/unmount lifecycle methods
  */
  enabled?: boolean,
};

let focusScopeInitFromProps = false;

/* eslint-disable react/sort-comp */
export default class FocusLock extends Component<Props> {
  ariaHiddenNode: HTMLElement
  componentIsMounted: boolean = false
  teardownFromProps: boolean = false
  static defaultProps = {
    autoFocus: false,
  }
  static contextTypes = {
    /** available when invoked within @atlaskit/layer-manager */
    ariaHiddenNode: PropTypes.object,
  }

  componentDidMount() {
    this.componentIsMounted = true;

    focusScopeInitFromProps = false;

    this.initialise();
  }
  componentWillUnmount() {
    this.componentIsMounted = false;

    if (!focusScopeInitFromProps && !this.teardownFromProps) {
      this.teardown({ shouldRestoreFocus: true });
    }
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.enabled && nextProps.enabled !== this.props.enabled) {
      focusScopeInitFromProps = true;
      this.initialise();
    }

    if (!nextProps.enabled && nextProps.enabled !== this.props.enabled) {
      this.teardownFromProps = true;
      this.teardown({ shouldRestoreFocus: true });
    }
  }
  initialise = () => {
    // NOTE: Only one element can be focused at a time.
    // Teardown all instances of FocusLock before another
    // initialises (mounts or becomes `enabled`).
    this.teardown({ shouldRestoreFocus: false });

    if (!this.componentIsMounted) return;

    this.ariaHiddenNode = this.props.ariaHiddenNode || this.context.ariaHiddenNode;

    focusStore.storeFocus();
    this.findFocusTarget();

    if (this.ariaHiddenNode) {
      this.ariaHiddenNode.setAttribute('aria-hidden', '');
    }
  }
  teardown = (options: { shouldRestoreFocus: boolean }) => {
    if (this.ariaHiddenNode) {
      this.ariaHiddenNode.removeAttribute('aria-hidden');
    }

    focusScope.unscopeFocus();

    if (options.shouldRestoreFocus) {
      focusStore.restoreFocus();
    }
  }
  findFocusTarget() {
    const { autoFocus } = this.props;

    const focusNode = findDOMNode(this); // eslint-disable-line react/no-find-dom-node
    const hasFocusFunc = typeof autoFocus === 'function';
    const focusFirstAvailable = (autoFocus && !hasFocusFunc) || false;

    // allow time for react's DOM reconciliation
    setTimeout(() => {
      if (focusNode) {
        focusScope.scopeFocus(focusNode, focusFirstAvailable);
      }

      // call the consumer's ref function
      if (typeof autoFocus === 'function') {
        const focusTarget = autoFocus();

        // check that the provided focusTarget is what we expect, warn otherwise
        if (!focusTarget || typeof focusTarget.focus !== 'function') {
          console.warn('Invalid `autoFocus` provided:', focusTarget); // eslint-disable-line no-console
          return;
        }

        focusTarget.focus();
      }
    }, 1);
  }

  render() {
    return Children.only(this.props.children);
  }
}
