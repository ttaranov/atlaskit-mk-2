import * as React from 'react';
import * as UtilSharedStyles from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

export type Color = 'grey' | 'red' | 'blue' | 'green' | 'purple' | 'yellow';

export type Props = React.HTMLProps<HTMLSpanElement> & {
  clickable?: boolean;
  color?: Color;
};

export const resolveColors = (color?: Color): [string, string, string] => {
  if (!color || color === 'grey') {
    return [
      UtilSharedStyles.akColorN30A,
      UtilSharedStyles.akColorN800,
      UtilSharedStyles.akColorN40,
    ];
  }

  const letter = color.toUpperCase().charAt(0);
  return [
    UtilSharedStyles[`akColor${letter}50`],
    UtilSharedStyles[`akColor${letter}500`],
    UtilSharedStyles[`akColor${letter}75`],
  ];
};

/**
 * TODO when update typescript to 2.9+
 * add custom props as Generic Parameter to span instead of casting
 */
export const DateLozenge = styled.span`
  border-radius: ${UtilSharedStyles.akBorderRadius};
  padding: 2px 4px;
  margin: 0 1px;
  position: relative;
  transition: background 0.3s;
  white-space: nowrap;
  cursor: ${(props: Props) => (props.onClick ? 'pointer' : 'unset')};

  ${(props: Props) => {
    const [background, color, hoverBackground] = resolveColors(props.color);
    return `
      background: ${background};
      color: ${color};
      &:hover {
        background: ${hoverBackground};
      }
    `;
  }};
` as React.ComponentType<Props>;
