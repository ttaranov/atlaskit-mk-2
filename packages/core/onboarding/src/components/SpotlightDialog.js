// @flow
import React, {
  Component,
  type ElementType,
  type Element,
  type Node,
} from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { Popper, type Placement } from '@atlaskit/popper';
import { FocusLock } from '@atlaskit/layer-manager';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import type { ActionsType } from '../types';
import { Image } from '../styled/Dialog';
import SpotlightCard from './SpotlightCard';
import ValueChanged from './ValueChanged';

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
  /** js object containing the animation styles to apply to component */
  animationStyles: Object,
};

type State = {
  hasFocusLock: boolean,
};

class SpotlightDialog extends Component<Props, State> {
  state = {
    hasFocusLock: false,
  };

  componentDidMount() {
    setTimeout(() => {
      // we delay the enabling of the focus lock to avoid the scroll position
      // jumping around in some situations
      this.setState({ hasFocusLock: true });
    }, 200);
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
      targetNode,
    } = this.props;
    const { hasFocusLock } = this.state;

    const translatedPlacement: Placement | void = dialogPlacement
      ? {
          'top left': 'top-start',
          'top center': 'top',
          'top right': 'top-end',
          'right top': 'right-start',
          'right middle': 'right',
          'right bottom': 'right-end',
          'bottom left': 'bottom-start',
          'bottom center': 'bottom',
          'bottom right': 'bottom-end',
          'left top': 'left-start',
          'left middle': 'left',
          'left bottom': 'left-end',
        }[dialogPlacement]
      : undefined;

    return (
      <Popper referenceElement={targetNode} placement={translatedPlacement}>
        {({ ref, style, scheduleUpdate }) => (
          <ValueChanged value={dialogWidth} onChange={scheduleUpdate}>
            <FocusLock enabled={hasFocusLock} returnFocus={false}>
              <SpotlightCard
                ref={ref}
                theme={({ container }) => ({
                  container: () => ({
                    ...container(),
                    ...style,
                    ...animationStyles,
                    width: `${dialogWidth}px`,
                  }),
                })}
                actions={actions}
                actionsBeforeElement={actionsBeforeElement}
                image={image && <Image alt={heading} src={image} />}
                components={{
                  Header: header,
                  Footer: footer,
                }}
                heading={heading}
              >
                {children}
              </SpotlightCard>
            </FocusLock>
          </ValueChanged>
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
