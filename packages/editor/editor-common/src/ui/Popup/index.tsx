import * as React from 'react';
import { PureComponent } from 'react';
import rafSchedule from 'raf-schd';
import { akEditorFloatingPanelZIndex } from '../../styles';
import Portal from '../Portal';
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

export default class Popup extends PureComponent<Props, State> {
  scrollElement: undefined | false | HTMLElement;
  static defaultProps = {
    offset: [0, 0],
    boundariesElement: document.body,
  };

  state: State = {
    overflowScrollParent: false,
  };

  private scheduledResizeFrame: number | null = null;
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
      boundariesElement!,
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

  /**
   * Popup initialization.
   * Checks whether it's possible to position popup along given target, and if it's not throws an error.
   */
  private initPopup(popup: HTMLElement) {
    const { target } = this.props;
    const overflowScrollParent = findOverflowScrollParent(popup);

    if (popup.offsetParent && !popup.offsetParent.contains(target!)) {
      throw new Error(
        "Popup's offset parent doesn't contain target which means it's impossible to correctly position popup along with given target.",
      );
    }

    if (
      overflowScrollParent &&
      !overflowScrollParent.contains(popup.offsetParent)
    ) {
      throw new Error(
        'Popup is inside "overflow: scroll" container, but its offset parent isn\'t. Currently Popup isn\'t capable of position itself correctly in such case. Add "position: relative" to "overflow: scroll" container or to some other FloatingPanel wrapper inside it.',
      );
    }

    this.setState({ popup, overflowScrollParent }, () => this.updatePosition());
  }

  private handleRef = (popup: HTMLDivElement) => {
    if (!popup) {
      return;
    }

    this.initPopup(popup);
  };

  private scheduledUpdatePosition = rafSchedule(() => this.updatePosition());

  private handleReposition = () => {
    this.scheduledResizeFrame = this.scheduledUpdatePosition();
  };

  componentWillReceiveProps(newProps: Props) {
    this.updatePosition(newProps);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleReposition);

    const { stickToBottom } = this.props;

    if (stickToBottom) {
      this.scrollElement = findOverflowScrollParent(this.props.target!);
    } else {
      this.scrollElement = this.props.scrollableElement;
    }
    if (this.scrollElement) {
      this.scrollElement.addEventListener('scroll', this.handleReposition);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleReposition);
    if (this.scheduledResizeFrame) {
      cancelAnimationFrame(this.scheduledResizeFrame);
    }

    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.handleReposition);
    }
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
      return <Portal mountTo={this.props.mountTo}>{this.renderPopup()}</Portal>;
    }

    // Without mountTo property renders popup as is,
    // which means it will be croped by "overflow: hidden" container.
    return this.renderPopup();
  }
}
