import Avatar from '@atlaskit/avatar';
import { components } from '@atlaskit/select';
import * as React from 'react';
import styled from 'styled-components';

const PlaceholderIconContainer = styled.span`
  margin-right: 6px;
  padding: 0;
  line-height: 0;
`;

export const Placeholder: React.StatelessComponent<any> = props => {
  const {
    selectProps: { placeholder, appearance },
    children,
  } = props;
  return (
    <components.Placeholder {...props}>
      <PlaceholderIconContainer>
        <Avatar
          size={appearance === 'normal' ? 'small' : 'xsmall'}
          name={placeholder}
          isHover={false}
        />
      </PlaceholderIconContainer>
      <div>{children}</div>
    </components.Placeholder>
  );
};
