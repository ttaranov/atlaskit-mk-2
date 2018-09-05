// @flow
import { Appearance } from '@atlaskit/theme';
import React, { PureComponent, type Node } from 'react';
import Container from './styledContainer';
import Content from './styledContent';
import { boldStyles, defaultStyles } from './theme';

export type Appearances =
  | 'default'
  | 'success'
  | 'removed'
  | 'inprogress'
  | 'new'
  | 'moved'
  | {};

type Props = {
  /** Determines whether to apply the bold style or not. */
  isBold?: boolean,
  /** The appearance type. */
  appearance: Appearances,
  /** max-width of lozenge container. Default to 200px. */
  maxWidth?: number | string,
  forwardRef: ref => void,
  /** Elements to be rendered inside the lozenge. This should ideally be just
   a word or two. */
  children?: Node,
};

export default class Lozenge extends PureComponent<Props> {
  static defaultProps = {
    isBold: false,
    appearance: 'default',
    maxWidth: 200,
  };

  render() {
    const { forwardRef, appearance, isBold, maxWidth, children } = this.props;
    console.log(
      '# Lozenge.forwardRef: ',
      forwardRef,
      ' appearance: ',
      appearance,
    );
    return (
      <Appearance
        props={appearance}
        theme={isBold ? boldStyles : defaultStyles}
      >
        {styleProps => (
          <Container {...styleProps} maxWidth={maxWidth} isBold={isBold}>
            <Content innerRef={forwardRef}>{children}</Content>
          </Container>
        )}
      </Appearance>
    );
  }
}
