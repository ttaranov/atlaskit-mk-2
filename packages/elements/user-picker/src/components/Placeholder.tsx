import Avatar from '@atlaskit/avatar';
import { components } from '@atlaskit/select';
import * as React from 'react';
import styled from 'styled-components';

const PlaceholderIconContainer = styled.span`
  margin-right: 6px;
  padding: 0;
  line-height: 0;
`;

const PlaceHolderIcon = ({ hasValue, label, inputValue, appearance }) => {
  if (!hasValue || (inputValue && inputValue.length > 0)) {
    return (
      <PlaceholderIconContainer>
        <Avatar
          size={appearance === 'normal' ? 'small' : 'xsmall'}
          name={label}
          isHover={false}
        />
      </PlaceholderIconContainer>
    );
  }
  return null;
};

export const Placeholder: React.StatelessComponent<any> = props => {
  const {
    selectProps: { placeholder, inputValue, appearance },
    hasValue,
    children,
  } = props;
  return (
    <components.Placeholder {...props}>
      <PlaceHolderIcon
        label={placeholder}
        inputValue={inputValue}
        hasValue={hasValue}
        appearance={appearance}
      />
      <div>{children}</div>
    </components.Placeholder>
  );
};
