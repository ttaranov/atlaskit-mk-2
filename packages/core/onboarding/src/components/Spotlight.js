// @flow
/* eslint-disable react/sort-comp, react/no-multi-comp */
import React, {
  Component,
  type ComponentType,
  type ElementType,
  type Element,
  type Node,
} from 'react';
import { ThemeProvider } from 'styled-components';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { FocusLock, withRenderTarget } from '@atlaskit/layer-manager';
import Layer from '@atlaskit/layer';
import { layers } from '@atlaskit/theme';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import { getSpotlightTheme } from './theme';
import type { ActionsType } from '../types';

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
import { withSpotlightState } from './SpotlightManager';
import { compose, withScrollMeasurements } from '../hoc';

type Props = {
  /** Buttons to render in the footer */
  actions?: ActionsType,
  /** An optional element rendered beside the footer actions */
  actionsBeforeElement?: Element<*>,
  /** The elements rendered in the modal */
  children: Node,
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

type FillProps = {
  in: boolean,
  scrollDistance: number,
  children: Node,
};

const Fill = (props: FillProps) => <Fade component={FillScreen} {...props} />;

/* eslint-disable react/prop-types, react/no-danger */
const Clone = ({ html }) => (
  <div
    dangerouslySetInnerHTML={{ __html: html }}
    style={{ pointerEvents: 'none' }}
  />
);
/* eslint-enable react/prop-types, react/no-danger */

class Spotlight extends Component<Props> {
  static defaultProps = {
    dialogWidth: 400,
    pulse: true,
  };

  handleTargetClick = (event: MouseEvent) => {
    const { targetOnClick, target } = this.props;

    if (targetOnClick) targetOnClick({ event, target });
  };

  renderTargetClone() {
    const {
      // $FlowFixMe - `clone` & `rect` are NOT public API
      clone, // eslint-disable-line react/prop-types
      // $FlowFixMe - `clone` & `rect` are NOT public API
      rect, // eslint-disable-line react/prop-types
      pulse,
      target,
      targetBgColor,
      targetOnClick,
      targetNode,
      targetRadius,
      targetReplacement: Replacement,
    } = this.props;

    if (!target && !targetNode) {
      const targetText = target ? ` matching "${target}".` : '.';
      throw Error(`Spotlight couldn't find a target${targetText}.`);
    }

    return Replacement ? (
      <Replacement {...rect} />
    ) : (
      <TargetOuter style={rect}>
        <TargetInner
          pulse={pulse}
          bgColor={targetBgColor}
          radius={targetRadius}
          style={rect}
        >
          <Clone html={clone} />
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
      // $FlowFixMe - in is not in props
      in: transitionIn, // eslint-disable-line react/prop-types
      image,
      // $FlowFixMe - in is not in props
      scrollY, // eslint-disable-line react/prop-types
    } = this.props;

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
      <ThemeProvider theme={getSpotlightTheme}>
        <FocusLock enabled={transitionIn} returnFocus={false}>
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
      <Fill in={transitionIn} scrollDistance={scrollY}>
        <Layer
          boundariesElement="scrollParent"
          content={dialog}
          offset="0 8"
          position={dialogPlacement}
          zIndex={layers.spotlight()}
        >
          {this.renderTargetClone()}
        </Layer>
      </Fill>
    );
  }
}

const portalConfig = { target: 'spotlight', withTransitionGroup: true };
const portal = comp => withRenderTarget(portalConfig, comp);
const enhance = compose(withSpotlightState, withScrollMeasurements, portal);

export const SpotlightWithoutAnalytics = enhance(Spotlight);
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'spotlight',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    targetOnClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'spotlight',

      attributes: {
        componentName: 'spotlight',
        packageName,
        packageVersion,
      },
    }),
  })(SpotlightWithoutAnalytics),
);
