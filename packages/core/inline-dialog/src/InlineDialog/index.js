// @flow

import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import NodeResolver from 'react-node-resolver';
import { Manager, Reference, Popper } from '@atlaskit/popper';
import type { Props } from '../types';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import { Container } from './styled';

class InlineDialog extends Component<Props, {}> {
  static defaultProps = {
    children: null,
    content: null,
    isOpen: false,
    onContentBlur: () => {},
    onContentClick: () => {},
    onContentFocus: () => {},
    onClose: () => {},
    placement: 'bottom-start',
  };

  containerRef: ?HTMLElement = null;
  triggerRef: ?HTMLElement = null;

  componentDidUpdate(prevProps: Props) {
    if (typeof window === 'undefined') return;

    if (!prevProps.isOpen && this.props.isOpen) {
      window.addEventListener('click', this.handleClickOutside, true);
    } else if (prevProps.isOpen && !this.props.isOpen) {
      window.removeEventListener('click', this.handleClickOutside);
    }
  }

  componentDidMount() {
    if (typeof window === 'undefined') return;

    if (this.props.isOpen) {
      window.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnMount() {
    if (typeof window === 'undefined') return;

    window.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event: any) => {
    const { isOpen, onClose } = this.props;

    if (event.defaultPrevented) return;

    const container: ?HTMLElement = this.containerRef;
    const trigger: ?HTMLElement = this.triggerRef;
    const target: HTMLElement = event.target;

    // exit if we click outside but on the trigger — it can handle the clicks itself
    if (trigger && trigger.contains(target)) return;

    // call onClose if the click originated from outside the dialog
    if (isOpen && container && !container.contains(target)) {
      onClose({ isOpen: false, event });
    }
  };

  render() {
    const {
      children,
      placement,
      isOpen,
      content,
      onContentBlur,
      onContentFocus,
      onContentClick,
    } = this.props;

    const popper = isOpen ? (
      <Popper placement={placement}>
        {({ ref, style, outOfBoundaries }) => (
          <Container
            onBlur={onContentBlur}
            onFocus={onContentFocus}
            onClick={onContentClick}
            outOfBoundaries={outOfBoundaries}
            innerRef={node => {
              this.containerRef = node;
              ref(node);
            }}
            style={style}
          >
            {content}
          </Container>
        )}
      </Popper>
    ) : null;

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <NodeResolver
              innerRef={node => {
                this.triggerRef = node;
                ref(node);
              }}
            >
              {children}
            </NodeResolver>
          )}
        </Reference>
        {popper}
      </Manager>
    );
  }
}

export { InlineDialog as InlineDialogWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'inlineDialog',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClose: createAndFireEventOnAtlaskit({
      action: 'closed',
      actionSubject: 'inlineDialog',

      attributes: {
        componentName: 'inlineDialog',
        packageName,
        packageVersion,
      },
    }),
  })(InlineDialog),
);
