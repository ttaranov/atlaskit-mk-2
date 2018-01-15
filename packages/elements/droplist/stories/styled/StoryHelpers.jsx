import styled from 'styled-components';
import {
  akColorN0,
  akColorN800,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';

export const GroupsWrapper = styled.div`
  padding: ${akGridSizeUnitless * 4}px;
`;

export const DropImitation = styled.div`
  background: ${akColorN0};
  margin-top: ${akGridSizeUnitless}px;
  width: 300px;
`;

export const ItemsNarrowContainer = styled.div`
  align-items: center;
  background: ${akColorN0};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: ${akGridSizeUnitless}px;
  width: auto;
`;

export const BlockTrigger = styled.div`
  border: 1px solid ${akColorN800};
`;
