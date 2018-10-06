// @flow
import React, { Component } from 'react';
import uuid from 'uuid/v1';
import Container, { Action, StyledButton } from './styledFlagActions';
import type { ActionsType, AppearanceTypes, ActionType } from '../../types';
import { DEFAULT_APPEARANCE } from '../Flag';

type Props = {
  appearance: AppearanceTypes,
  actions: ActionsType,
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
    const { actions, appearance } = this.props;
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
          appearance={appearance}
        >
          {action.content}
        </StyledButton>
      </Action>
    ));

    return <Container>{items}</Container>;
  }
}
