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

const PlaceHolderIcon = ({ hasValue, label, inputValue, appearence }) => {
  if (!hasValue || (inputValue && inputValue.length > 0)) {
    return (
      <PlaceholderIconContainer>
        <Avatar
          size={appearence === 'normal' ? 'small' : 'xsmall'}
          name={label}
        />
      </PlaceholderIconContainer>
    );
  }
  return null;
};

export const Placeholder: React.StatelessComponent<any> = props => {
  const {
    selectProps: { placeholder, inputValue, appearence },
    hasValue,
    children,
  } = props;
  return (
    <components.Placeholder {...props}>
      <PlaceHolderIcon
        label={placeholder}
        inputValue={inputValue}
        hasValue={hasValue}
        appearence={appearence}
      />
      <div>{children}</div>
    </components.Placeholder>
  );
};
