import React, { Component } from 'react';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import { colors, themed } from '@atlaskit/theme';
import { withTheme, ThemeProvider } from 'styled-components';
import { HiddenCheckbox, IconWrapper, Label, Wrapper } from './styled/Checkbox';

import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { name, version } from '../../package.json';

const backgroundColor = themed({ light: colors.N40A, dark: colors.DN10 });
const transparent = themed({ light: 'transparent', dark: 'transparent' });
