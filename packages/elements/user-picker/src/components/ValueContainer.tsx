import Avatar from '@atlaskit/avatar';
import * as React from 'react';
import { components } from 'react-select';
import styled from 'styled-components';

// type Props = {};

const ChildrenContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const PlaceholderIconContainer = styled.span`
  margin-right: 8px;
  padding: 0;
  line-height: 0;
`;

const PlaceHolderIcon = ({ hasValue, label, inputValue, appearence }) => {
  if (!hasValue || (inputValue && inputValue.length > 0)) {
    return (
      <PlaceholderIconContainer>
        <Avatar
          size={appearence === 'normal' ? 'medium' : 'xsmall'}
          name={label}
        />
      </PlaceholderIconContainer>
    );
  }
  return null;
};

export const ValueContainer: React.StatelessComponent<any> = props => {
  const { children, ...valueContainerProps } = props;
  const {
    selectProps: { placeholder, inputValue, appearence },
    hasValue,
  } = valueContainerProps;
  return (
    <components.ValueContainer {...valueContainerProps}>
      <PlaceHolderIcon
        label={placeholder}
        inputValue={inputValue}
        hasValue={hasValue}
        appearence={appearence}
      />
      <ChildrenContainer>{children}</ChildrenContainer>
    </components.ValueContainer>
  );
};
