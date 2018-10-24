export const getStyles = width => ({
  menu: css => ({ ...css, width }),
  control: css => ({
    ...css,
    width,
    flexWrap: 'nowrap',
  }),
  input: css => ({ ...css, lineHeight: '44px' }),
  valueContainer: css => ({
    ...css,
    flexGrow: 1,
    overflow: 'hidden',
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
});
