import React, { Component } from 'react';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import { colors, themed } from '@atlaskit/theme';
import { withTheme, ThemeProvider } from 'styled-components';
import { withAnalyticsEvents, withAnalyticsContext } from '@atlaskit/analytics-next';
import { name as packageName, version as packageVersion } from '../../package.json';
import { HiddenCheckbox, IconWrapper, Label, Wrapper } from './styled/Checkbox';

const backgroundColor = themed({ light: colors.N40A, dark: colors.DN10 });
const transparent = themed({ light: 'transparent', dark: 'transparent' });

class Button extends Component { }
export default withAnalyticsContext({
  component: 'button',
  package: packageName,
  version: packageVersion
})(withAnalyticsEvents({
  onClick: createAnalyticsEvent => {
    const consumerEvent = createAnalyticsEvent({
      action: 'click',
    });
    consumerEvent.clone().fire('atlaskit');

    return consumerEvent;
  }
})(Button));
