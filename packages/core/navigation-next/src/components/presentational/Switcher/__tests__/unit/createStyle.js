// @flow

import createStyle from '../../createStyle';

describe('createStyle', () => {
  it('should return an object with option property', () => {
    const style = createStyle({});
    expect(style).not.toBeUndefined();
    expect(style).toEqual({
      option: expect.any(Function),
    });
  });

  it('should return default option if no user option styles is given', () => {
    const style = createStyle({});
    expect(style.option({}, {})).toEqual({
      alignItems: 'center',
      border: 'none',
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
      color: 'inherit',
      cursor: 'default',
      display: 'flex',
      flexShrink: 0,
      fontSize: 'inherit',
      height: 8 * 6,
      outline: 'none',
      paddingRight: 8,
      paddingLeft: 8,
      textAlign: 'left',
      textDecoration: 'none',
      width: '100%',
    });
  });

  it('should merge default option and user option styles', () => {
    const style = createStyle({
      option: base => ({
        ...base,
        color: 'red',
        backgroundColor: 'blue',
      }),
    });
    const option = style.option({}, {});
    expect(option).toEqual({
      alignItems: 'center',
      border: 'none',
      backgroundColor: 'blue',
      boxSizing: 'border-box',
      color: 'red',
      cursor: 'default',
      display: 'flex',
      flexShrink: 0,
      fontSize: 'inherit',
      height: 8 * 6,
      outline: 'none',
      paddingRight: 8,
      paddingLeft: 8,
      textAlign: 'left',
      textDecoration: 'none',
      width: '100%',
    });
  });
});
