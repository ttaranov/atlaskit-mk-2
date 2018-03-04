import React, { Component } from 'react';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import { colors, themed } from '@atlaskit/theme';
import { withTheme, ThemeProvider } from 'styled-components';
import { HiddenCheckbox, IconWrapper, Label, Wrapper } from './styled/Checkbox';

import { withAnalyticsEvents, withAnalyticsContext } from '@atlaskit/analytics-next';
import { name, version } from '../../package.json';

const backgroundColor = themed({ light: colors.N40A, dark: colors.DN10 });
const transparent = themed({ light: 'transparent', dark: 'transparent' });

class Button extends Component { }
export default withAnalyticsContext({
  component: 'button',
  package: name,
  version: version
})(withAnalyticsEvents({
  onClick: createAnalyticsEvent => {
    const consumerEvent = createAnalyticsEvent({
      action: 'click',
    });
    consumerEvent.clone().fire('atlaskit');

    return consumerEvent;
  }
})(Button));
