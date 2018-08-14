// @flow
import React, {
  type ComponentType,
  type ElementType,
  type Element,
  type Node,
} from 'react';
import { layers } from '@atlaskit/theme';
import Portal from '@atlaskit/portal';
import { Fade } from './Animation';
import Spotlight from './SpotlightInternal';
import type { ActionsType } from '../types';

export type Props = {
  /** Buttons to render in the footer */
  actions?: ActionsType,
  /** An optional element rendered beside the footer actions */
  actionsBeforeElement?: Element<*>,
  /** The elements rendered in the modal */
  children?: Node,
  /** Where the dialog should appear, relative to the contents of the children. */
  dialogPlacement?:
    | 'top left'
    | 'top center'
    | 'top right'
    | 'right top'
    | 'right middle'
    | 'right bottom'
    | 'bottom left'
    | 'bottom center'
    | 'bottom right'
    | 'left top'
    | 'left middle'
    | 'left bottom',
  /** The width of the dialog in pixels. Min 160 - Max 600 */
  dialogWidth: number,
  /** Optional element rendered below the body */
  footer?: ElementType,
  /** Optional element rendered above the body */
  header?: ElementType,
  /** Heading text rendered above the body */
  heading?: string,
  /** Path to the the your image */
  image?: string,
  /** Whether or not the Spotlight is visible */
  isOpen: boolean,
  /** Whether or not to display a pulse animation around the spotlighted element */
  pulse: boolean,
  /** The name of the SpotlightTarget */
  target?: string,
  /** The spotlight target node */
  targetNode?: HTMLElement,
  /** The background color of the element being highlighted */
  targetBgColor?: string,
  /** Function to fire when a user clicks on the cloned target */
  targetOnClick?: ({ event: MouseEvent, target?: string }) => void,
  /** The border-radius of the element being highlighted */
  targetRadius?: number,
  /** Alternative element to render than the wrapped target */
  targetReplacement?: ComponentType<*>,
};

class SpotlightWrapper extends React.Component<Props> {
  static defaultProps = {
    dialogWidth: 400,
    isOpen: true,
    pulse: true,
  };

  render() {
    const { isOpen, ...rest } = this.props;
    return (
      <Fade in={isOpen}>
        {animationStyles => (
          <Portal zIndex={layers.spotlight()}>
            <Spotlight {...rest} animationStyles={animationStyles} />
          </Portal>
        )}
      </Fade>
    );
  }
}

export default SpotlightWrapper;
