import styled from 'styled-components';
import { akZIndexBlanket, akZIndexDialog, akBorderRadius, akColorN400, akColorN0, akColorN20, akColorN30 } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const Container = styled.div`
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: ${akZIndexBlanket};
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// tslint:disable-next-line:variable-name
export const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  opacity: 0.5;
  right: 0;
  top: 0;
  transition: opacity 220ms;
  position: fixed;
  background-color: ${akColorN400};
`;

// tslint:disable-next-line:variable-name
export const Dialog = styled.div`
  width: 80%;
  height: 80%;
  display: flex;
  max-width: 800px;
  max-height: 650px;
  color: ${akColorN400};
  flex-direction: column;
  z-index: ${akZIndexDialog};
  background-color: ${akColorN0};
  border-radius: ${akBorderRadius};
`;

// tslint:disable-next-line:variable-name
export const Header = styled.div`
  min-height: 24px;
  padding: 20px 40px;
  font-size: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// tslint:disable-next-line:variable-name
export const IconWrapper = styled.div`
`;

// tslint:disable-next-line:variable-name
export const ContentWrapper = styled.div`
  padding: 20px 5%;
  border-bottom-right-radius: ${akBorderRadius};
  overflow: auto;
  box-shadow: inset 0px 2px 0px 0px ${akColorN30};
  position: relative;
  width: 90%;
`;

// tslint:disable-next-line:variable-name
export const Line = styled.div`
  background: #fff;
  content: "";
  display: block;
  height: 2px;
  left: 0;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  min-width: 604px;
`;

// tslint:disable-next-line:variable-name
export const Content = styled.div`
  min-width: 524px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

// tslint:disable-next-line:variable-name
export const ColumnLeft = styled.div`
  width: 44%;
`;

// tslint:disable-next-line:variable-name
export const ColumnRight = styled.div`
  width: 44%;
`;

// tslint:disable-next-line:variable-name
export const Row = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
`;

// tslint:disable-next-line:variable-name
export const Title = styled.div`
  font-size: 18px;
  font-weight: 400;
`;

// tslint:disable-next-line:variable-name
export const CodeSm = styled.span`
  background-color: ${akColorN20};
  border-radius: ${akBorderRadius};
  width: 24px;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  text-align: center;
`;

// tslint:disable-next-line:variable-name
export const CodeMd = styled.span`
  background-color: ${akColorN20};
  border-radius: ${akBorderRadius};
  display: inline-block;
  height: 24px;
  line-height: 24px;
  width: 50px;
  text-align: center;
`;

// tslint:disable-next-line:variable-name
export const CodeLg = styled.span`
  background-color: ${akColorN20};CodeLg
  border-radius: ${akBorderRadius};
  display: inline-block;
  height: 24px;
  line-height: 24px;
  padding: 0 10px ;
  text-align: center;
`;
