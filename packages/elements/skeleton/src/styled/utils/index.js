// @flow
import type { Weight } from '../../types';

export const getColor = (color: string): string => color || 'currentColor';

export const getOpacity = (weight: Weight): number =>
  weight === 'strong' ? 0.3 : 0.15;
