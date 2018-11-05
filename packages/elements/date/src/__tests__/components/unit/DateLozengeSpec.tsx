import { resolveColors } from '../../../components/DateLozenge';
import { colors } from '@atlaskit/theme';

describe('resolveColors', () => {
  it('return default colors', () => {
    expect(resolveColors()).toEqual([colors.N30A, colors.N800, colors.N40]);

    expect(resolveColors('grey')).toEqual([
      colors.N30A,
      colors.N800,
      colors.N40,
    ]);
  });

  it('return red colors', () => {
    expect(resolveColors('red')).toEqual([colors.R50, colors.R500, colors.R75]);
  });

  it('return blue colors', () => {
    expect(resolveColors('blue')).toEqual([
      colors.B50,
      colors.B500,
      colors.B75,
    ]);
  });

  it('return green colors', () => {
    expect(resolveColors('green')).toEqual([
      colors.G50,
      colors.G500,
      colors.G75,
    ]);
  });

  it('return purple colors', () => {
    expect(resolveColors('purple')).toEqual([
      colors.P50,
      colors.P500,
      colors.P75,
    ]);
  });

  it('return yellow colors', () => {
    expect(resolveColors('yellow')).toEqual([
      colors.Y50,
      colors.Y500,
      colors.Y75,
    ]);
  });
});
