// @flow

import React, { Component, type Node as NodeType } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import NodeResolver from 'react-node-resolver';
import { Manager, Reference, Popper } from '@atlaskit/popper';
import type { Placement } from '@atlaskit/popper';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import { Container } from './styled';

type Props = {
  /** The elements that the InlineDialog will be positioned relative to. */
  children: NodeType,
  /** The elements to be displayed within the InlineDialog. */
  content: NodeType,
  /** Sets whether to show or hide the dialog. */
  isOpen: boolean,
  /** Function called when you lose focus on the object. */
  onContentBlur: () => void,
  /** Function called when you click on the open dialog. */
  onContentClick: () => void,
  /** Function called when you focus on the open dialog. */
  onContentFocus: () => void,
  /** Function called when the dialog is open and a click occurs anywhere outside
  the dialog. Calls with an object { isOpen: false } and the type of event that
  triggered the close. */
  onClose: Function,
  /** Where the dialog should appear, relative to the contents of the children. */
  placement: Placement,
};

class InlineDialog extends Component<Props, {}> {
  static defaultProps = {
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
    if (!prevProps.isOpen && this.props.isOpen) {
      window.addEventListener('click', this.handleClickOutside);
    } else if (prevProps.isOpen && !this.props.isOpen) {
      window.removeEventListener('click', this.handleClickOutside);
    }
  }

  handleClickOutside = (event: Event) => {
    if (event.defaultPrevented) return;

    const container: ?HTMLElement = this.containerRef;
    const trigger: ?HTMLElement = this.triggerRef;

    // exit if we click outside but on the trigger — it can handle the clicks itself
    if (trigger && !trigger.contains(event.target)) {
      return;
    }

    if (container && !container.contains(event.target)) {
      this.props.onClose({ isOpen: false, event });
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
