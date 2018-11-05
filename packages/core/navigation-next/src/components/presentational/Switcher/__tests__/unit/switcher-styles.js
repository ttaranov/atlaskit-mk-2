// @flow

import { createStyles } from '../../switcher-styles';

describe('createStyles', () => {
  it('should return an object with option property', () => {
    const styles = createStyles();
    expect(styles).toEqual({
      option: expect.any(Function),
    });
  });

  it('should return default option styles if no custom option styles is given', () => {
    const styles = createStyles();
    expect(styles.option({}, {})).toEqual({
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

  it('should merge default option styles and custom option styles', () => {
    const customStyles = {
      option: base => ({
        ...base,
        color: 'red',
        backgroundColor: 'blue',
      }),
    };
    const styles = createStyles(customStyles);
    const option = styles.option({}, {});
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

  it('should return expected option styles when isFocused is true', () => {
    const styles = createStyles();
    const state = {
      isFocused: true,
      isActive: false,
    };

    expect(styles.option({}, state)).toEqual({
      alignItems: 'center',
      border: 'none',
      backgroundColor: '#EBECF0',
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

  it('should return expected option styles when isFocused and isActive are true', () => {
    const styles = createStyles();
    const state = {
      isFocused: true,
      isActive: true,
    };

    expect(styles.option({}, state)).toEqual({
      alignItems: 'center',
      border: 'none',
      backgroundColor: '#DEEBFF',
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
});
