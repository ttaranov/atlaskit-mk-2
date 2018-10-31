import { components } from '@atlaskit/select';
import * as React from 'react';
import styled from 'styled-components';

export const ScrollAnchor = styled.div`
  align-self: flex-end;
`;

export type State = {
  valueSize: number;
  previousValueSize: number;
};

export class ValueContainer extends React.PureComponent<any, State> {
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      valueSize: nextProps.getValue ? nextProps.getValue().length : 0,
      previousValueSize: prevState.valueSize,
    };
  }

  private bottomAnchor;

  constructor(props) {
    super(props);
    this.state = {
      valueSize: 0,
      previousValueSize: 0,
    };
  }

  componentDidUpdate() {
    const { previousValueSize, valueSize } = this.state;
    if (valueSize > previousValueSize) {
      setTimeout(() => this.bottomAnchor.scrollIntoView());
    }
  }

  handleBottomAnchor = ref => {
    this.bottomAnchor = ref;
  };

  render() {
    const { children, ...valueContainerProps } = this.props;
    return (
      <components.ValueContainer {...valueContainerProps}>
        {children}
        <ScrollAnchor innerRef={this.handleBottomAnchor} />
      </components.ValueContainer>
    );
  }
}
