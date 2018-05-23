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
  /** Elements to be rendered inside the lozenge. This should ideally be just
   a word or two. */
  children?: Node,
};

export default class Lozenge extends PureComponent<Props> {
  static defaultProps = {
    isBold: false,
    appearance: 'default',
  };

  render() {
    const { appearance, isBold, children } = this.props;

    return (
      <Appearance
        props={appearance}
        theme={isBold ? boldStyles : defaultStyles}
      >
        {styleProps => (
          <Container {...styleProps} isBold={isBold}>
            <Content>{children}</Content>
          </Container>
        )}
      </Appearance>
    );
  }
}
