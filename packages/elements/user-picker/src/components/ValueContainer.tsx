import { components } from '@atlaskit/select';
import * as React from 'react';
import styled from 'styled-components';

const ScrollAnchor = styled.div`
  align-self: flex-end;
`;

export type State = {
  valueSize: number;
  previousValueSize: number;
};

export class ValueContainer extends React.PureComponent<any, State> {
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      valueSize: nextProps.getValue().length,
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

  componentDidUpdate(prevProps, prevState) {
    const { previousValueSize, valueSize } = this.state;
    if (previousValueSize && valueSize > previousValueSize) {
      setTimeout(() => this.bottomAnchor.scrollIntoView());
    }
  }

  handleBottomAnchor = ref => {
    this.bottomAnchor = ref;
  };

  render() {
    const { children, ...valueContainerProps } = this.props;
    return (
      <components.ValueContainer
        data-test="hey! it is me!!"
        {...valueContainerProps}
      >
        {children}
        <ScrollAnchor innerRef={this.handleBottomAnchor} />
      </components.ValueContainer>
    );
  }
}
