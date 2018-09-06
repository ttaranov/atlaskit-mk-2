// @flow

import { Theme } from '@atlaskit/theme';
import React, { PureComponent, type Node } from 'react';
import Container from './styledContainer';
import Content from './styledContent';
import { theme } from './theme';

export type Appearances =
  | 'default'
  | 'success'
  | 'removed'
  | 'inprogress'
  | 'new'
  | 'moved'
  | {};

type Props = {
  /** The appearance type. */
  appearance: Appearances,

  /** Elements to be rendered inside the lozenge. This should ideally be just a word or two. */
  children?: Node,

  /** Determines whether to apply the bold style or not. */
  isBold: boolean,

  /** max-width of lozenge container. Default to 200px. */
  maxWidth: number | string,

  /** The theme the component should use. */
  theme: ThemeProps => ThemeProps,
};

export default class Lozenge extends PureComponent<Props> {
  static defaultProps = {
    isBold: false,
    appearance: 'default',
    maxWidth: 200,
    theme,
  };

  render() {
    const { props } = this;
    return (
      <Theme values={props.theme}>
        {({ lozenge }) => (
          <Container {...lozenge(props)}>
            <Content>{props.children}</Content>
          </Container>
        )}
      </Theme>
    );
  }
}
