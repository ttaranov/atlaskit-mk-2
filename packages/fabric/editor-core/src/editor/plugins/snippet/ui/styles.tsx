import * as React from 'react';
import styled from 'styled-components';
import {
  akColorN20,
  akColorN800,
  akColorN30,
  akColorB300,
  akColorB400,
  akColorN200,
} from '@atlaskit/util-shared-styles';

export const PickerRow = styled.div`
  display: flex;
  padding: 8px;
  width: 100%;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${akColorN30};
  }

  .content {
    flex-grow: 1;
    .name {
      color: ${akColorN800};
    }
    .value {
      color: ${akColorN200};
      font-size: 12px;
    }
  }
  .icon {
    width: 24px;
    height: 24px;
    align-self: center;
    justify-self: center;
    margin-right: 12px;
  }
  .lock {
    margin-right: 24px;
  }
`;

export const PickerScroll = styled.div`
  border: 1px solid #fff;
  border-radius: 3px;
  display: block;
  margin: 0;
  overflowx: hidden;
  overflowy: auto;
  padding: 0;
`;

export const PickerList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 8px;

  background: white;
  border: 1px solid #dfe1e6;
  border-radius: 3px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  color: '#333';
  width: 320px;
  max-height: 350px;
`;
