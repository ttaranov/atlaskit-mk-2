// @flow
/* eslint-disable react/sort-comp, react/no-multi-comp */
import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { FocusLock, withRenderTarget } from '@atlaskit/layer-manager';
import Layer from '@atlaskit/layer';
import { layers } from '@atlaskit/theme';

import { getTheme } from './theme';
import type {
  ActionsType,
  ComponentType,
  ChildrenType,
  ElementType,
} from '../types';

import {
  Dialog,
  DialogBody,
  FillScreen,
  Heading,
  Image,
} from '../styled/Dialog';

import { TargetOverlay, TargetOuter, TargetInner } from '../styled/Target';
import { Fade } from './Animation';
import Actions from './SpotlightActions';
import withScrollMeasurements from '../hoc/withScrollMeasurements';

type Props = {|
  /** Buttons to render in the footer */
  actions?: ActionsType,
  /** An optional element rendered beside the footer actions */
  actionsBeforeElement?: ElementType,
  /** The elements rendered in the modal */
  children: ChildrenType,
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
  dialogWidth?: number,
  /** Optional element rendered below the body */
  footer?: ElementType,
  /** Optional element rendered above the body */
  header?: ElementType,
  /** Heading text rendered above the body */
  heading?: string,
  /** Path to the the your image */
  image?: string,
  /** Whether or not to display a pulse animation around the spotlighted element */
  pulse?: boolean,
  /** The name of the SpotlightTarget */
  target: string,
  /** The background color of the element being highlighted */
  targetBgColor?: string,
  /** Function to fire when a user clicks on the cloned target */
  targetOnClick?: ({ event: MouseEvent, target: string }) => void,
  /** The border-radius of the element being highlighted */
  targetRadius?: number,
  /** Alternative element to render than the wrapped target */
  targetReplacement?: ComponentType,
|};

type FillProps = {
  in: boolean,
  onExit: Function,
  scrollDistance: number,
  children: ChildrenType,
};

const Fill = (props: FillProps) => <Fade component={FillScreen} {...props} />;

type State = {|
  isExiting: boolean,
|};

/* eslint-disable react/prop-types, react/no-danger */
const Clone = ({ html }) => (
  <div
    dangerouslySetInnerHTML={{ __html: html }}
    style={{ pointerEvents: 'none' }}
  />
);
/* eslint-enable react/prop-types, react/no-danger */

class Spotlight extends Component<Props, State> {
  state: State = { isExiting: false };

  static defaultProps = {
    dialogWidth: 400,
    pulse: true,
  };

  handleTargetClick = (event: MouseEvent) => {
    const { targetOnClick, target } = this.props;

    if (targetOnClick) targetOnClick({ event, target });
  };
  handleExit = () => {
    // NOTE: disable FocusLock *before* unmount. animation may end after a new
    // spotlight as gained focus, breaking focus behaviour.
    this.setState({ isExiting: true });
  };

  renderTargetClone() {
    // NOTE: `clone` & `rect` are NOT public API
    const {
      pulse,
      target,
      targetBgColor,
      targetOnClick,
      targetRadius,
      targetReplacement: Replacement,
      ...props
    } = this.props;

    if (!target) {
      throw Error(`Spotlight couldn't find a target matching "${target}".`);
    }

    return Replacement ? (
      <Replacement {...props.rect} />
    ) : (
      <TargetOuter style={props.rect}>
        <TargetInner
          pulse={pulse}
          bgColor={targetBgColor}
          radius={targetRadius}
          style={props.rect}
        >
          <Clone html={props.clone} />
          <TargetOverlay onClick={targetOnClick && this.handleTargetClick} />
        </TargetInner>
      </TargetOuter>
    );
  }

  render() {
    // NOTE: `scrollY` & `in` are NOT public API
    const {
      actions,
      actionsBeforeElement,
      children,
      dialogPlacement,
      dialogWidth,
      footer,
      header,
      heading,
      image,
      ...props
    } = this.props;

    const { isExiting } = this.state;

    // warn consumers when they provide conflicting props
    if (header && image) {
      console.warn('Please provide "header" OR "image", not both.'); // eslint-disable-line no-console
    }
    if (footer && actions) {
      console.warn('Please provide "footer" OR "actions", not both.'); // eslint-disable-line no-console
    }

    // prepare header/footer elements
    const headerElement =
      header || (image ? <Image alt={heading} src={image} /> : null);
    const footerElement =
      footer ||
      (actions ? (
        <Actions beforeElement={actionsBeforeElement} items={actions} />
      ) : null);

    // build the dialog before passing it to Layer
    const dialog = (
      <ThemeProvider theme={getTheme}>
        <FocusLock enabled={!isExiting} autoFocus>
          <Dialog width={dialogWidth} tabIndex="-1">
            {headerElement}
            <DialogBody>
              {heading && <Heading>{heading}</Heading>}
              {children}
            </DialogBody>
            {footerElement}
          </Dialog>
        </FocusLock>
      </ThemeProvider>
    );

    return (
      <Fill
        in={props.in}
        onExit={this.handleExit}
        scrollDistance={props.scrollY}
      >
        <Layer
          boundariesElement="scrollParent"
          content={dialog}
          offset="0 8"
          position={dialogPlacement}
          zIndex={layers.spotlight(this.props)}
        >
          {this.renderTargetClone()}
        </Layer>
      </Fill>
    );
  }
}

export default withScrollMeasurements(
  withRenderTarget(
    {
      target: 'spotlight',
      withTransitionGroup: true,
    },
    Spotlight,
  ),
);
