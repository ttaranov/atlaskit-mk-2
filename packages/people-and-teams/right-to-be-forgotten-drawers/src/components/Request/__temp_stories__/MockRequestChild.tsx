import React from 'react';
import styled from 'styled-components';
import { colors, elevation } from '@atlaskit/theme';
import { CallbackArguments } from '../types';

const Outer = styled.div`
  width: 180px;
  padding: 8px;
  margin: 16px;
  border-radius: 3px;
  ${elevation.e300};
  background-color: ${colors.N10};
`;

interface Props {
  isLoading: boolean;
  error: object;
  data: any; // tslint:disable-line no-any
  sendRequest?: (...args: CallbackArguments) => Promise<void>;
  title?: string;
}

export class MockRequestChild extends React.Component<Props> {
  getStatus = () => {
    const { isLoading, error, data } = this.props;
    if (isLoading) {
      return 'Loading 🕒';
    }
    if (error) {
      return 'Error ⚠️';
    }
    if (data === undefined) {
      return 'Empty state 📭';
    }
    return 'Done ✅';
  };

  render() {
    const { data, sendRequest, title } = this.props;
    return (
      <Outer>
        <h3>{title || 'Request'}</h3>
        {sendRequest && <button onClick={sendRequest}>Send</button>}
        <div>Status: {this.getStatus()}</div>
        {data && <div>Data: {data}</div>}
      </Outer>
    );
  }
}

export default MockRequestChild;
