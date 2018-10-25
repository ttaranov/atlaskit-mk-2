export type Tool =
  | 'line'
  | 'brush'
  | 'arrow'
  | 'oval'
  | 'rectangle'
  | 'blur'
  | 'move';

export interface Color {
  red: number;
  green: number;
  blue: number;
}

export function isColorSame(lhs: Color, rhs: Color) {
  return (
    lhs.red === rhs.red && lhs.green === rhs.green && lhs.blue === rhs.blue
  );
}

export function colorToCssString(color: Color): string {
  const { red, green, blue } = color;
  return `rgb(${red}, ${green}, ${blue})`;
}
