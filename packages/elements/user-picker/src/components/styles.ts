import memoizeOne from 'memoize-one';

export const getStyles = memoizeOne(width => ({
  menu: css => ({ ...css, width }),
  control: (css, state) => ({
    ...css,
    width,
    flexWrap: 'nowrap',
    borderColor: state.isFocused
      ? css.borderColor
      : state.selectProps.subtle
        ? 'transparent'
        : '#DFE1E6',
    backgroundColor: state.selectProps.subtle ? 'transparent' : '#FAFBFC',
    '&:hover .atlassian-user-picker__clear-indicator': {
      opacity: 1,
    },
    ':hover': {
      ...css[':hover'],
      borderColor: state.isFocused
        ? css[':hover'].borderColor
        : state.selectProps.subtle && state.selectProps.hoveringClearIndicator
          ? '#FFEBE6'
          : css[':hover'].backgroundColor,
      backgroundColor:
        state.selectProps.subtle && state.selectProps.hoveringClearIndicator
          ? '#FFEBE6'
          : css[':hover'].backgroundColor,
    },
    padding: 0,
    minHeight: state.selectProps.appearence === 'compact' ? 32 : 44,
    alignItems: 'stretch',
  }),
  clearIndicator: ({
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    ...css
  }) => ({
    ...css,
    opacity: 0,
    transition: css.transition + ', opacity 150ms',
    paddingTop: 0,
    padding: 0,
    ':hover': {
      color: '#DE350B',
    },
  }),
  valueContainer: ({ paddingTop, paddingBottom, ...css }) => ({
    ...css,
    flexGrow: 1,
    overflow: 'hidden',
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
  }),
  multiValue: css => ({
    ...css,
    borderRadius: 24,
  }),
  multiValueRemove: css => ({
    ...css,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  }),
  placeholder: css => ({
    ...css,
    marginLeft: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }),
}));
