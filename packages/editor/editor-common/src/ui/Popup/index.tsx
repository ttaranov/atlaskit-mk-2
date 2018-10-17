import * as React from 'react';
import { createPortal } from 'react-dom';
import rafSchedule from 'raf-schd';
import { akEditorFloatingPanelZIndex } from '../../styles';
import {
  calculatePosition,
  calculatePlacement,
  findOverflowScrollParent,
  Position,
} from './utils';

export interface Props {
  zIndex?: number;
  alignX?: 'left' | 'right' | 'center';
  alignY?: 'top' | 'bottom';
  target?: HTMLElement;
  fitHeight?: number;
  fitWidth?: number;
  boundariesElement?: HTMLElement;
  mountTo?: HTMLElement;
  // horizontal offset, vertical offset
  offset?: number[];
  onPositionCalculated?: (position: Position) => Position;
  onPlacementChanged?: (placement: [string, string]) => void;
  scrollableElement?: HTMLElement;
  stickToBottom?: boolean;
  ariaLabel?: string;
}

export interface State {
  // Popup Html element reference
  popup?: HTMLElement;

  position?: Position;

  overflowScrollParent: HTMLElement | false;
}

export default class Popup extends React.Component<Props, State> {
  scrollElement: undefined | false | HTMLElement;
  static defaultProps = {
    offset: [0, 0],
  };

  state: State = {
    overflowScrollParent: false,
  };

  private placement: [string, string] = ['', ''];

  /**
   * Calculates new popup position
   */
  private updatePosition(props = this.props, state = this.state) {
    const {
      target,
      fitHeight,
      fitWidth,
      boundariesElement,
      offset,
      onPositionCalculated,
      onPlacementChanged,
      alignX,
      alignY,
      stickToBottom,
    } = props;
    const { popup } = state;

    if (!target || !popup) {
      return;
    }

    const placement = calculatePlacement(
      target,
      boundariesElement || document.body,
      fitWidth,
      fitHeight,
      alignX,
      alignY,
    );
    if (onPlacementChanged && this.placement.join('') !== placement.join('')) {
      onPlacementChanged(placement);
      this.placement = placement;
    }

    let position = calculatePosition({
      placement,
      popup,
      target,
      offset: offset!,
      stickToBottom,
    });
    position = onPositionCalculated ? onPositionCalculated(position) : position;

    this.setState({ position });
  }

  private cannotSetPopup(popup, target, overflowScrollParent) {
    /**
     * Check whether:
     * 1. Popup's offset targets which means whether or not its possible to correctly position popup along with given target.
     * 2. Popup is inside "overflow: scroll" container, but its offset parent isn't.
     *
     * Currently Popup isn't capable of position itself correctly in case 2,
     * Add "position: relative" to "overflow: scroll" container or to some other FloatingPanel wrapper inside it.
     */

    return (
      (document.body.contains(target) &&
        (popup.offsetParent && !popup.offsetParent.contains(target!))) ||
      (overflowScrollParent &&
        !overflowScrollParent.contains(popup.offsetParent))
    );
  }

  /**
   * Popup initialization.
   * Checks whether it's possible to position popup along given target, and if it's not throws an error.
   */
  private initPopup(popup: HTMLElement) {
    const { target } = this.props;
    const overflowScrollParent = findOverflowScrollParent(popup);

    if (this.cannotSetPopup(popup, target, overflowScrollParent)) {
      return;
    }

    this.setState({ popup, overflowScrollParent }, () => this.updatePosition());
  }

  private handleRef = (popup: HTMLDivElement) => {
    if (!popup) {
      return;
    }

    this.initPopup(popup);
  };

  private scheduledUpdatePosition = rafSchedule(props =>
    this.updatePosition(props),
  );

  onResize = () => this.scheduledUpdatePosition();

  componentWillReceiveProps(newProps: Props) {
    // We are delaying `updatePosition` otherwise it happens before the children
    // get rendered and we end up with a wrong position
    this.scheduledUpdatePosition(newProps);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);

    const { stickToBottom } = this.props;

    if (stickToBottom) {
      this.scrollElement = findOverflowScrollParent(this.props.target!);
    } else {
      this.scrollElement = this.props.scrollableElement;
    }
    if (this.scrollElement) {
      this.scrollElement.addEventListener('scroll', this.onResize);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.onResize);
    }
    this.scheduledUpdatePosition.cancel();
  }

  private renderPopup() {
    const { position } = this.state;

    return (
      <div
        ref={this.handleRef}
        style={{
          position: 'absolute',
          zIndex: this.props.zIndex || akEditorFloatingPanelZIndex,
          ...position,
        }}
        aria-label={this.props.ariaLabel || 'Popup'}
        // Indicates component is an editor pop. Required for focus handling in Message.tsx
        data-editor-popup
      >
        {this.props.children}
      </div>
    );
  }

  render() {
    if (!this.props.target) {
      return null;
    }

    if (this.props.mountTo) {
      return createPortal(this.renderPopup(), this.props.mountTo);
    }

    // Without mountTo property renders popup as is,
    // which means it will be cropped by "overflow: hidden" container.
    return this.renderPopup();
  }
}
