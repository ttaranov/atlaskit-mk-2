export type Alignment = 'left' | 'right' | 'center';
export type Display = 'inline-block' | 'block';

export function textAlign(alignment: Alignment, display: Display): string {
  if (display !== 'block') {
    return 'left';
  }
  return alignment;
}

export function float(alignment: Alignment, display: Display): string {
  if (display === 'block') {
    return 'none';
  }

  return alignment === 'right' ? 'right' : 'left';
}

export function clear(alignment: Alignment, display: Display): string {
  if (display === 'block') {
    return 'both';
  }

  return alignment === 'center' ? 'both' : alignment;
}
