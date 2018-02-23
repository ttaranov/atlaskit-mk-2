import {
  akGridSizeUnitless,
  akBorderRadius,
  akColorN400,
  akColorN60A,
  akColorP400,
} from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const ButtonContent = styled.span`
  display: flex;
  height: 24px;
  min-width: 65px;
  padding: 0 5px;
  align-items: center;
`;

// tslint:disable-next-line:variable-name
export const Wrapper = styled.span`
  display: flex;
  margin-right: ${({ width }) =>
    !width || width === 'large' ? 0 : akGridSizeUnitless}px;
`;

// tslint:disable-next-line:variable-name
export const ConfirmationPopup = styled.div`
  background: #ffffff;
  border-radius: ${akBorderRadius};
  box-shadow: 0 4px 8px -2px ${akColorN60A}, 0 0 1px ${akColorN60A};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  overflow: auto;
  max-height: none;
  height: 410px;
  width: 280px;
  align-items: center;
`;

// tslint:disable-next-line:variable-name
export const ConfirmationText = styled.div`
  font-size: 14px;
  word-spacing: 4px;
  line-height: 22px;
  color: ${akColorN400};
  margin-top: 30px;
  padding: 20px;
  & > div:first-of-type {
    margin-bottom: 12px;
  }
  & > div:nth-of-type(2) {
    margin-bottom: 20px;
  }
`;

export const ConfirmationHeader = styled.div`
  background-color: ${akColorP400};
  height: 100px;
  width: 100%;
  display: inline-block;
`;

export const ConfirmationImg = styled.img`
  width: 100px;
  position: absolute;
  top: 25px;
`;
