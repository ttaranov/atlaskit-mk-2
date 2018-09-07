// @flow
import globalItemStyles from '../../styles';

const modeArgs = {
  product: {
    background: {
      default: '#0065FF',
      hint: '#0F63E0',
      static: '#0B4BAA',
      interact: '#104493',
    },
    text: { default: '#DEEBFF', subtle: '#5AAD91' },
  },
};

const commonArgs = {
  isActive: false,
  isSelected: false,
  isHover: false,
  size: 'small',
};

describe('Navigation Next: GlobalItem styles', () => {
  let themeMode;
  beforeEach(() => {
    themeMode = globalItemStyles(modeArgs);
  });

  it('should add the default background color into the items styles if element has no active states', () => {
    expect(themeMode(commonArgs).itemBase.backgroundColor).toEqual('#0065FF');
  });

  it('should add the active background into the base item styles if element state is `:active`', () => {
    expect(
      themeMode({ ...commonArgs, isActive: true }).itemBase.backgroundColor,
    ).toEqual('#104493');
  });

  it('should add the active background into the base item styles if element state is `:hover`', () => {
    expect(
      themeMode({ ...commonArgs, isHover: true }).itemBase.backgroundColor,
    ).toEqual('#0F63E0');
  });
});
