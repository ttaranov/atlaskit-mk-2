import { toHumanReadableMediaSize } from '../../src/utils';
import { getCSSUnitValue } from '../../src/utils/getCSSUnitValue';

describe('index', () => {
  describe('getCSSUnitValue', () => {
    it('should pass through strings as unchanged', () => {
      const validUnit = '5em';
      expect(getCSSUnitValue(validUnit)).toEqual(validUnit);

      const invalidUnit = 'knight to e4';
      expect(getCSSUnitValue(invalidUnit)).toEqual(invalidUnit);
    });

    it('should append "px" to the end of numbers', () => {
      const positiveUnit = 999;
      expect(getCSSUnitValue(positiveUnit)).toEqual(`${positiveUnit}px`);

      const negativeUnit = -700;
      expect(getCSSUnitValue(negativeUnit)).toEqual(`${negativeUnit}px`);
    });
  });

  describe('toHumanReadableMediaSize', () => {
    it('should return no decimal places when the media size is less than 1 MB', () => {
      const oneByte = 1;
      expect(toHumanReadableMediaSize(oneByte)).toEqual('1 B');

      const oneHundredBytes = 100;
      expect(toHumanReadableMediaSize(oneHundredBytes)).toEqual('100 B');

      const oneHundredAndFiftyKiloBytes = 153600;
      expect(toHumanReadableMediaSize(oneHundredAndFiftyKiloBytes)).toEqual(
        '150 KB',
      );
    });

    it('should return one decimal place when the media size is greater than or equal to 1 MB', () => {
      const onePointFiveMegaBytes = 1572864;
      expect(toHumanReadableMediaSize(onePointFiveMegaBytes)).toEqual('1.5 MB');

      const twelvePointThreeMegaBytes = 12897490;
      expect(toHumanReadableMediaSize(twelvePointThreeMegaBytes)).toEqual(
        '12.3 MB',
      );

      const onePointThreeGigaBytes = 1395864375;
      expect(toHumanReadableMediaSize(onePointThreeGigaBytes)).toEqual(
        '1.3 GB',
      );
    });
  });
});
