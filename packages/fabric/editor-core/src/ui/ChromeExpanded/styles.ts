import styled from 'styled-components';
import { akEditorSubtleAccent } from '../../styles';
import {
  akBorderRadius,
  akGridSize,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';
import ContentStyles from '../../editor/ui/ContentStyles';

// tslint:disable-next-line:variable-name
export const Container = styled.div`
  background-color: white;
  border: 1px solid ${akEditorSubtleAccent};
  box-sizing: border-box;
  border-radius: ${akBorderRadius};

  /* Create a stacking context, so that the toolbar can be placed above the content */
  position: relative;

  &:focus {
    outline: none;
  }
`;

// tslint:disable-next-line:variable-name
export const Content = styled(ContentStyles)`
  position: relative;

  .ProseMirror {
    padding: 12px 20px;
  }
`;

// tslint:disable-next-line:variable-name
export const Footer = styled.div`
  font-size: 14px;
  padding: 20px;
  padding-top: 10px;
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

// tslint:disable-next-line:variable-name
export const FooterActions = styled.div`
  display: flex;
  flex-grow: 1;
`;

// tslint:disable-next-line:variable-name
export const IconButton = styled.div`
  cursor: pointer;
  font-size: inherit;
  background: none;
  border: none;
  padding: 0;
  margin-left: 5px;
  margin-right: 5px;
`;

// tslint:disable-next-line:variable-name
export const Toolbar = styled.div`
  align-items: center;
  display: flex;
  height: 40px;
  padding: 0 ${akGridSize};
  position: relative;

  & > * {
    align-items: center;
    display: flex;
    margin-left: ${akGridSizeUnitless/2}px;
    /* Firefox|IE toolbar icons fix: https://product-fabric.atlassian.net/browse/ED-1787 */
    min-width: 0;

    &:first-child {
      margin-left: 0;
      align-items: center;
    }
  }
`;

// tslint:disable-next-line:variable-name
export const SecondaryToolbar = styled.div`
  align-items: flex-start;
  display: flex;
`;

// tslint:disable-next-line:variable-name
export const ButtonGroup = styled.span`
  display: flex;

  & > span:not(:first-child) {
    margin-left: ${akGridSizeUnitless/2}px;
  }
`;
