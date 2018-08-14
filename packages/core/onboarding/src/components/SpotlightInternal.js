// @flow
import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { FocusLock } from '@atlaskit/layer-manager';
import Layer from '@atlaskit/layer';
import { layers } from '@atlaskit/theme';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import { getSpotlightTheme } from './theme';

import {
  Dialog,
  DialogBody,
  FillScreen,
  Heading,
  Image,
} from '../styled/Dialog';

import { TargetOverlay, TargetOuter, TargetInner } from '../styled/Target';
import Actions from './SpotlightActions';
import { withSpotlightState } from './SpotlightManager';
import { compose, withScrollMeasurements } from '../hoc';
import { type Props as SpotlightProps } from './Spotlight';

type Props = SpotlightProps & {
  /** js object containing the animation styles to apply to component */
  animationStyles: Object,
  /** HTML of the target element */
  clone: string,
  /** vertical scroll distance to the target element */
  scrollY: number,
  /** the dimensions of the target element */
  rect: {},
};

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
      clone,
      rect,
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
    const {
      actions,
      actionsBeforeElement,
      animationStyles,
      children,
      dialogPlacement,
      dialogWidth,
      footer,
      header,
      heading,
      image,
      isOpen,
      scrollY,
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
        <Dialog width={dialogWidth} tabIndex="-1">
          <FocusLock enabled={isOpen} returnFocus={false}>
            <React.Fragment>
              {headerElement}
              <DialogBody>
                {heading && <Heading>{heading}</Heading>}
                {children}
              </DialogBody>
              {footerElement}
            </React.Fragment>
          </FocusLock>
        </Dialog>
      </ThemeProvider>
    );

    return (
      <FillScreen scrollDistance={scrollY} style={animationStyles}>
        <Layer
          boundariesElement="scrollParent"
          content={dialog}
          offset="0 8"
          position={dialogPlacement}
          zIndex={layers.spotlight()}
        >
          {this.renderTargetClone()}
        </Layer>
      </FillScreen>
    );
  }
}

const enhance = compose(withSpotlightState, withScrollMeasurements);

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
