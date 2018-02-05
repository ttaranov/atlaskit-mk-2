// @flow

import React, { Component, type Node as NodeType } from 'react';
import ReactDOM from 'react-dom';
import Layer from '@atlaskit/layer';
import { gridSize } from '@atlaskit/theme';
import { Container } from './styled';
import type { PositionType, FlipPositionsType } from '../types';

// TODO: expose positions and flipPositions from Layer and pull in here

type Props = {
  /** Element to act as a boundary for the InlineDialog.
  The InlineDialog Layer will not sit outside this element if it can help it.
  If, through it's normal positoning,
  it would end up outside the boundary
  the layer will flip positions. */
  boundariesElement?: 'viewport' | 'window' | 'scrollParent',
  /** The elements that the InlineDialog will be positioned relative to. */
  children?: NodeType,
  /** The elements to be displayed within the InlineDialog. */
  content?: NodeType,
  /** Sets whether to show or hide the dialog. */
  isOpen?: boolean,
  /** Function called when you lose focus on the object. */
  onContentBlur?: Function,
  /** Function called when you click on the open dialog. */
  onContentClick?: Function,
  /** Function called when you focus on the open dialog. */
  onContentFocus?: Function,
  /** Function called when the dialog is open and a click occurs anywhere outside
  the dialog. Calls with an object { isOpen: false } and the type of event that
  triggered the close. */
  onClose?: Function,
  /** Where the dialog should appear, relative to the contents of the children. */
  position?: PositionType,
  /** Whether the dialog's position should be altered when there is no space
  for it in its default position. If an array is passed, it will use the first
  position where there is enough space, displaying in the last position if none
  have enough space. */
  shouldFlip?: boolean | Array<FlipPositionsType>,
};

// TODO: expose applicable props from Layer and pull in here
export default class InlineDialog extends Component<Props, {}> {
  static defaultProps = {
    isOpen: false,
    onContentBlur: () => {},
    onContentClick: () => {},
    onContentFocus: () => {},
    onClose: () => {},
    position: 'bottom center',
    shouldFlip: false,
  };

  componentDidMount = () => {
    document.addEventListener('click', this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener('click', this.handleClickOutside);
  };

  handleClickOutside = (event: Event) => {
    if (event.defaultPrevented) return;

    if (this.props.isOpen) {
      const domNode = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
      if (
        !domNode ||
        (event.target instanceof Node && !domNode.contains(event.target))
      ) {
        if (this.props.onClose) this.props.onClose({ isOpen: false, event });
      }
    }
  };

  render() {
    const {
      boundariesElement,
      children,
      content,
      isOpen,
      onContentBlur,
      onContentClick,
      onContentFocus,
      position,
      shouldFlip,
    } = this.props;

    // this offset is passed to popper as two space separated numbers representing
    // the offset from the target the first is distance along the same axis you are
    // on (top or bottom aligned would move left/right) and the second is on the
    // perpendicular axis (how far 'away' you are from the target) both are measured
    // in pixels
    // $FlowFixMe TEMPORARY
    const dialogOffset = `0 ${gridSize(this.props)}`;

    const layerContent = isOpen ? (
      <Container
        onBlurCapture={onContentBlur}
        onClick={onContentClick}
        onFocusCapture={onContentFocus}
        tabIndex="-1"
      >
        {content}
      </Container>
    ) : null;

    return (
      <Layer
        boundariesElement={boundariesElement}
        autoFlip={shouldFlip}
        content={layerContent}
        offset={dialogOffset}
        position={position}
      >
        <div>{children}</div>
      </Layer>
    );
  }
}
