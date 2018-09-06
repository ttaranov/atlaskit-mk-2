// @flow
import globalNavStyles from '../../styles';

const modeArgs = {
  product: {
    background: {
      default: '#DEEBFF',
      hint: 'hint',
      static: 'static',
      interact: 'interact',
    },
    text: { default: '#0065FF', subtle: 'subtle' },
  },
};

describe('Navigation Next: GlobalNav styles', () => {
  let styles;
  beforeEach(() => {
    styles = globalNavStyles(modeArgs)();
  });

  it('should add the styles for background color based on the given product mode colors', () => {
    expect(styles).toMatchObject({ backgroundColor: '#DEEBFF' });
  });

  it('should add the styles for text color based on the given product mode colors', () => {
    expect(styles).toMatchObject({ color: '#0065FF' });
  });

  it('should add the styles for SVG fill color based on the given product mode colors', () => {
    expect(styles).toMatchObject({ fill: '#DEEBFF' });
  });
});
