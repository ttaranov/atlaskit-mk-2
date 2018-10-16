import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import * as React from 'react';

export const UserMultiValueRemove = ({ data, innerProps }) => {
  const { className, ...otherProps } = innerProps;
  return (
    <div className={className}>
      <SelectClearIcon
        label="Remove"
        size="small"
        primaryColor="inherit"
        {...otherProps}
      />
    </div>
  );
};
