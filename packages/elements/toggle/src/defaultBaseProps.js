// @flow
import type { DefaultBaseProps } from './types';

const defaultBaseProps: DefaultBaseProps = {
  isChecked: false,
  isDisabled: false,
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
  size: 'regular',
  label: '',
  name: '',
  value: '',
};
export default defaultBaseProps;
