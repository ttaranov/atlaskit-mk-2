import { components } from '@atlaskit/select';
import * as React from 'react';
import styled from 'styled-components';
import Avatar from '@atlaskit/avatar';

const PlaceholderIconContainer = styled.div`
  padding-left: 12px;
  line-height: 0;
`;

export class SingleValueContainer extends React.PureComponent<any, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, ...valueContainerProps } = this.props;

    const { appearance } = valueContainerProps.selectProps;

    return (
      <components.ValueContainer {...valueContainerProps}>
        <PlaceholderIconContainer>
          {!valueContainerProps.hasValue ? (
            <Avatar
              isHover={false}
              size={appearance === 'normal' ? 'small' : 'xsmall'}
            />
          ) : null}
        </PlaceholderIconContainer>
        {children}
      </components.ValueContainer>
    );
  }
}
