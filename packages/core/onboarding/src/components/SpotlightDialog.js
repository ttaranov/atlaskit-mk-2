// @flow
import React, { Component, type ElementType } from 'react';
import { ThemeProvider } from 'styled-components';
import { Popper } from '@atlaskit/popper';
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
import SpotlightCard from './SpotlightCard';

import { TargetOverlay, TargetOuter, TargetInner } from '../styled/Target';
import Actions from './SpotlightActions';
import { SpotlightConsumer } from './SpotlightManager';
import { type Props as SpotlightProps } from './Spotlight';

type Props = {
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
  /** The spotlight target node */
  targetNode: HTMLElement,
  /** whether the spotlight is open or not */
  isOpen: boolean,
  /** js object containing the animation styles to apply to component */
  animationStyles: Object,
};

class SpotlightDialog extends Component<Props> {
  static defaultProps = {
    dialogWidth: 400,
    pulse: true,
  };

  state = {
    hasFocusLock: false,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ hasFocusLock: true });
    }, 500);
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
      targetNode,
    } = this.props;
    const { hasFocusLock } = this.state;

    // warn consumers when they provide conflicting props
    if (header && image) {
      console.warn('Please provide "header" OR "image", not both.'); // eslint-disable-line no-console
    }
    if (footer && actions) {
      console.warn('Please provide "footer" OR "actions", not both.'); // eslint-disable-line no-console
    }

    return (
      <Popper referenceElement={targetNode}>
        {({ ref, style, placement, outOfBoundaries }) => (
          <FocusLock enabled={hasFocusLock} returnFocus={false}>
            <SpotlightCard
              innerRef={ref}
              styles={{ ...style, ...animationStyles }}
              actions={actions}
              actionsBeforeElement={actionsBeforeElement}
              image={image && <Image alt={heading} src={image} />}
              components={{
                Header: header,
                Footer: footer,
              }}
              width={dialogWidth}
              heading={heading}
              data-placement={placement}
            >
              {children}
            </SpotlightCard>
          </FocusLock>
        )}
      </Popper>
    );
  }
}

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
  })(SpotlightDialog),
);
