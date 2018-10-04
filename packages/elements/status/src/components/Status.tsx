import * as React from 'react';
import Lozenge from '@atlaskit/lozenge';

export type Color = 'neutral' | 'purple' | 'blue' | 'red' | 'yellow' | 'green';

const colorToLozengeAppearanceMap: { [K in Color]: string } = {
  neutral: 'default',
  purple: 'new',
  blue: 'inprogress',
  red: 'removed',
  yellow: 'moved',
  green: 'success',
};

const DEFAULT_APPEARANCE = 'default';
const MAX_WIDTH = 200;

export interface Props {
  text: string;
  color: Color;
  localId?: string;
}

export function Status(props: Props) {
  const { text, color } = props;

  if (text.trim().length === 0) {
    return null;
  }

  const appearance = colorToLozengeAppearanceMap[color] || DEFAULT_APPEARANCE;

  return (
    <Lozenge appearance={appearance} maxWidth={MAX_WIDTH}>
      {text}
    </Lozenge>
  );
}
