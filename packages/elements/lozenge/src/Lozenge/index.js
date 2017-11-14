// @flow
import React, { PureComponent, type Node } from 'react';
import Container from './styledContainer';
import Content from './styledContent';

export type Appearances =
  | 'default'
  | 'success'
  | 'removed'
  | 'inprogress'
  | 'new'
  | 'moved';

export const APPEARANCE_ENUM = {
  values: ['default', 'success', 'removed', 'inprogress', 'new', 'moved'],
  defaultValue: 'default',
};

type Props = {
  /** Determines whether to apply the bold style or not. */
  isBold?: boolean,
  /** The appearance type. */
  appearance?: Appearances,
  /** Elements to be rendered inside the lozenge. This should ideally be just
   a word or two. */
  children?: Node,
};

export default class Lozenge extends PureComponent<Props> {
  static defaultProps = {
    isBold: false,
    appearance: APPEARANCE_ENUM.defaultValue,
  };

  // returns the assigned appearance if valid, falling back to the default otherwise
  validAppearance() {
    const { appearance } = this.props;
    const { values, defaultValue } = APPEARANCE_ENUM;
    return values.indexOf(appearance) !== -1 ? appearance : defaultValue;
  }

  render() {
    const { isBold, children } = this.props;

    return (
      <Container appearance={this.validAppearance()} isBold={isBold}>
        <Content>{children}</Content>
      </Container>
    );
  }
}
