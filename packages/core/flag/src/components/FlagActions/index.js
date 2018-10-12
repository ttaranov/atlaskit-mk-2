// @flow
import React, { Component, type ElementType } from 'react';
import uuid from 'uuid/v1';
import { ThemeProvider } from 'styled-components';
import Container, { Action, StyledButton } from './styledFlagActions';
import type { ActionsType, AppearanceTypes } from '../../types';
import { getFlagTheme } from '../../theme';
import { DEFAULT_APPEARANCE } from '../Flag';

type Props = {
  appearance: AppearanceTypes,
  actions: ActionsType,
  linkComponent?: ElementType,
};

export default class FlagActions extends Component<Props, {}> {
  props: Props; // eslint-disable-line react/sort-comp
  static defaultProps = {
    appearance: DEFAULT_APPEARANCE,
    actions: [],
  };
  /* eslint-disable no-undef */

  getButtonFocusRingColor = () => 'focusRingColor';

  getButtonTheme = () => 'buttonTheme';
  getButtonAppearance = (b: mixed) => (b ? 'default' : 'subtle-link');
  getButtonSpacing = (b: mixed) => (b ? 'compact' : 'none');
  getUniqueId = (prefix: string): string => `${prefix}-${uuid()}`;

  render() {
    const { actions, appearance, linkComponent } = this.props;
    const isBold = appearance !== DEFAULT_APPEARANCE;

    if (!actions.length) return null;

    const items = actions.map((action, index) => (
      <Action
        key={this.getUniqueId('flag-action')}
        hasDivider={!!index}
        useMidDot={!isBold}
      >
        <StyledButton
          onClick={action.onClick}
          href={action.href}
          target={action.target}
          // This is verymuch a hack
          // This should be tidied up when the appearance prop of flag is aligned
          // with other appearance props.
          appearance={appearance === 'normal' ? 'link' : appearance}
          component={linkComponent}
          spacing="compact"
        >
          {action.content}
        </StyledButton>
      </Action>
    ));

    return (
      <ThemeProvider theme={getFlagTheme}>
        <Container>{items}</Container>
      </ThemeProvider>
    );
  }
}
