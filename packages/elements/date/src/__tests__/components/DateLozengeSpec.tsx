import { resolveColors } from '../../components/DateLozenge';
import * as UtilSharedStyles from '@atlaskit/util-shared-styles';

describe('resolveColors', () => {
  it('return default colors', () => {
    expect(resolveColors()).toEqual([
      UtilSharedStyles.akColorN30A,
      UtilSharedStyles.akColorN800,
      UtilSharedStyles.akColorN40,
    ]);

    expect(resolveColors('grey')).toEqual([
      UtilSharedStyles.akColorN30A,
      UtilSharedStyles.akColorN800,
      UtilSharedStyles.akColorN40,
    ]);
  });

  it('return red colors', () => {
    expect(resolveColors('red')).toEqual([
      UtilSharedStyles.akColorR50,
      UtilSharedStyles.akColorR500,
      UtilSharedStyles.akColorR75,
    ]);
  });

  it('return blue colors', () => {
    expect(resolveColors('blue')).toEqual([
      UtilSharedStyles.akColorB50,
      UtilSharedStyles.akColorB500,
      UtilSharedStyles.akColorB75,
    ]);
  });

  it('return green colors', () => {
    expect(resolveColors('green')).toEqual([
      UtilSharedStyles.akColorG50,
      UtilSharedStyles.akColorG500,
      UtilSharedStyles.akColorG75,
    ]);
  });

  it('return purple colors', () => {
    expect(resolveColors('purple')).toEqual([
      UtilSharedStyles.akColorP50,
      UtilSharedStyles.akColorP500,
      UtilSharedStyles.akColorP75,
    ]);
  });

  it('return yellow colors', () => {
    expect(resolveColors('yellow')).toEqual([
      UtilSharedStyles.akColorY50,
      UtilSharedStyles.akColorY500,
      UtilSharedStyles.akColorY75,
    ]);
  });
});
