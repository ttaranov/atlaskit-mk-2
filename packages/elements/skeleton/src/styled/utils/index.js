// @flow
import type { Appearance } from '../../types';

export const getColor = (color: string): string => color || 'currentColor';

export const getOpacity = (appearance: Appearance): number =>
  appearance === 'strong' ? 0.3 : 0.15;
