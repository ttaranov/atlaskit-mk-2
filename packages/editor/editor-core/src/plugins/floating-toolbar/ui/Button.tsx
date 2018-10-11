import * as React from 'react';
import { ReactElement, MouseEvent } from 'react';

import Tooltip from '@atlaskit/tooltip';
import UiButton, { themeNamespace } from '@atlaskit/button';
import { colors, themed } from '@atlaskit/theme';

import styled, { ThemeProvider } from 'styled-components';
import { hexToRgba } from '@atlaskit/editor-common';

const editorButtonTheme = {
  danger: {
    background: {
      default: themed({ light: 'none' }),
      hover: themed({ light: colors.N30A }),
      active: themed({ light: hexToRgba(colors.B75, 0.6) }),
      disabled: themed({ light: 'none' }),
      selected: themed({ light: colors.N700 }),
      focusSelected: themed({ light: colors.N700 }),
    },
    color: {
      default: themed({ light: colors.N400 }),
      hover: themed({ light: colors.R300 }),
      active: themed({ light: colors.R300 }),
      disabled: themed({ light: colors.N70 }),
      selected: themed({ light: colors.N20 }),
      focusSelected: themed({ light: colors.N20 }),
    },
  },
};

const Button = styled(UiButton)`
  padding: 0 2px;
`;

export type ButtonAppearance = 'subtle' | 'danger';

export interface Props {
  title: string;
  icon: ReactElement<any>;
  onClick: (event: Event) => void;
  onMouseEnter?: <T>(event: MouseEvent<T>) => void;
  onMouseLeave?: <T>(event: MouseEvent<T>) => void;
  selected?: boolean;
  disabled?: boolean;
  appearance?: ButtonAppearance;
}

export default ({
  title,
  icon,
  onClick,
  onMouseEnter,
  onMouseLeave,
  selected,
  disabled,
  appearance = 'subtle',
}: Props) => {
  return (
    <Tooltip content={title} hideTooltipOnClick={true} position="top">
      <ThemeProvider theme={{ [themeNamespace]: editorButtonTheme }}>
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <Button
            ariaLabel={title}
            spacing="compact"
            appearance={appearance}
            ariaHaspopup={true}
            iconBefore={icon}
            onClick={onClick}
            isSelected={selected}
            isDisabled={disabled}
          />
        </div>
      </ThemeProvider>
    </Tooltip>
  );
};
