// @flow
import modeGenerator from '../../modeGenerator';

const modeArgs = { background: '#DEEBFF', text: '#0065FF' };

const commonArgs = {
  isActive: false,
  isSelected: false,
  isHover: false,
  size: 'small',
};

describe('NavigationNext theme: Mode generator', () => {
  let customThemeMode;

  beforeEach(() => {
    customThemeMode = modeGenerator(modeArgs);
  });

  describe('Global item styles', () => {
    it('should add the default background color into the items styles if element has no active states', () => {
      expect(customThemeMode.globalItem(commonArgs).itemBase).toMatchObject({
        backgroundColor: '#DEEBFF',
        fill: '#DEEBFF',
      });
    });

    it('should add the active background into the base item styles if element state is `:active`', () => {
      const args = { ...commonArgs, isActive: true };
      expect(customThemeMode.globalItem(args).itemBase).toMatchObject({
        backgroundColor: '#ffffff',
        fill: '#ffffff',
      });
    });

    it('should add the active background into the base item styles if element state is `:hover`', () => {
      const args = { ...commonArgs, isHover: true };
      expect(customThemeMode.globalItem(args).itemBase).toMatchObject({
        backgroundColor: '#abccff',
        fill: '#abccff',
      });
    });

    it('should add the active background into the base item styles if element state is `:select`', () => {
      const args = { ...commonArgs, isSelected: true };
      expect(customThemeMode.globalItem(args).itemBase).toMatchObject({
        backgroundColor: '#78adff',
        fill: '#78adff',
      });
    });
  });

  describe('Item styles', () => {
    it('should add the default background color into the items styles if element has no active states', () => {
      const args = { ...commonArgs, spacing: 'default' };
      expect(customThemeMode.item(args).container.itemBase).toMatchObject({
        backgroundColor: '#DEEBFF',
      });

      expect(customThemeMode.item(args).product.itemBase).toMatchObject({
        backgroundColor: '#DEEBFF',
      });
    });

    it('should add the active background into the base item styles if element state is `:active`', () => {
      const args = { ...commonArgs, isActive: true, spacing: 'default' };
      expect(customThemeMode.item(args).container.itemBase).toMatchObject({
        backgroundColor: '#ffffff',
      });
      expect(customThemeMode.item(args).product.itemBase).toMatchObject({
        backgroundColor: '#ffffff',
      });
    });

    it('should add the active background into the base item styles if element state is `:hover`', () => {
      const args = { ...commonArgs, isHover: true, spacing: 'default' };

      expect(customThemeMode.item(args).container.itemBase).toMatchObject({
        backgroundColor: '#abccff',
      });
      expect(customThemeMode.item(args).product.itemBase).toMatchObject({
        backgroundColor: '#abccff',
      });
    });

    it('should add the active text color into the items styles if element state is `:hover`', () => {
      const args = { ...commonArgs, isHover: true, spacing: 'default' };
      expect(customThemeMode.item(args).container.textWrapper).toMatchObject({
        color: '#0065FF',
      });

      expect(customThemeMode.item(args).container.subTextWrapper).toMatchObject(
        {
          color: '#66a2ff',
        },
      );
    });
  });
});
