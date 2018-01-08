// tslint:disable:variable-name
import {
  akColorB50,
  akColorB400,
  akColorN0,
  akColorN30,
  akColorN50,
  akColorN500,
} from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
`;

export const HoverArea = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin: 1px;

  &:hover {
    background-color: ${akColorN50};
  }
`;

export const MainArea = styled.div`
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 13px;
  margin: 2px;
  background-color: ${akColorN0};
`;

export const BackAreaBase = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  margin: 1px;
`;

export const BackAreaNormal = styled(BackAreaBase)`
  background-color: ${akColorN30};
`;

export const BackAreaSelected = styled(BackAreaBase)`
  background-color: ${akColorB50};
`;

export const FrontAreaBase = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const FrontAreaNormal = styled(FrontAreaBase)`
  background-color: ${akColorN500};
`;

export const FrontAreaSelected = styled(FrontAreaBase)`
  background-color: ${akColorB400};
`;
