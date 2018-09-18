// @flow

import { Theme } from '@atlaskit/theme';
import React, { PureComponent, type Node } from 'react';
import Container from './styledContainer';
import Content from './styledContent';
import {
  theme,
  type ThemeAppearance,
  type ThemeIn,
  type ThemeOut,
} from '../theme';

type Props = {
  /** The appearance type. */
  appearance: ThemeAppearance,

  /** Elements to be rendered inside the lozenge. This should ideally be just a word or two. */
  children?: Node,

  /** Determines whether to apply the bold style or not. */
  isBold: boolean,

  /** max-width of lozenge container. Default to 200px. */
  maxWidth: number | string,

  /** The theme the component should use. */
  theme: ThemeIn => ThemeOut,
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
      <Theme props={props} theme={props.theme}>
        {themeProps => {
          return (
            <Container {...themeProps}>
              <Content {...themeProps}>{props.children}</Content>
            </Container>
          );
        }}
      </Theme>
    );
  }
}
