// @flow
import React, { Component, Fragment } from 'react';
import Portal from '@atlaskit/portal';
import { Popper } from '@atlaskit/popper';
import { layers } from '@atlaskit/theme';
import { type Props as SpotlightProps } from './Spotlight';
import WindowedBlanket from '../styled/WindowBlanket';
import SpotlightCard from './SpotlightCard';
import { TargetConsumer } from './SpotlightNext';

type Props = SpotlightProps & { hasBlanket: boolean };

export default class SpotlightDialog extends Component<Props> {
  static defaultProps = {
    hasBlanket: true,
  };
  render() {
    const {
      actions,
      actionsBeforeElement,
      children,
      dialogWidth,
      footer,
      hasBlanket,
      header,
      heading,
      image,
    } = this.props;

    return (
      <Portal zIndex={layers.spotlight()}>
        <Fragment>
          {hasBlanket && (
            <TargetConsumer>
              {({ dimensions, radius }) => (
                <WindowedBlanket {...dimensions} radius={radius} />
              )}
            </TargetConsumer>
          )}
          <Popper>
            {({ ref, style, placement, outOfBoundaries }) => (
              <SpotlightCard
                innerRef={ref}
                styles={style}
                actions={actions}
                actionsBeforeElement={actionsBeforeElement}
                image={image && <img alt={heading} src={image} />}
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
            )}
          </Popper>
        </Fragment>
      </Portal>
    );
  }
}
