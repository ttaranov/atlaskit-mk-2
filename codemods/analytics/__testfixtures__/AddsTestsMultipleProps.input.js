import React, { Component } from 'react';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import { colors, themed } from '@atlaskit/theme';
import { withTheme, ThemeProvider } from 'styled-components';
import { HiddenCheckbox, IconWrapper, Label, Wrapper } from './styled/Checkbox';

const backgroundColor = themed({ light: colors.N40A, dark: colors.DN10 });
const transparent = themed({ light: 'transparent', dark: 'transparent' });

describe('ak-button/default-behaviour', () => {
  it('button should have type="button" by default', () =>
    expect(
      mount(<Button />)
        .find(ButtonBase)
        .props().type,
    ).toBe('button'));
});