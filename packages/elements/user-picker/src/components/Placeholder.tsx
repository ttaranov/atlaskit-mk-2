import Avatar from '@atlaskit/avatar';
import * as React from 'react';
import { components } from 'react-select';
import styled from 'styled-components';

// type Props = {
//   text: string;
//   children: string;
// };

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
