import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';

import {
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '../src/styles';

import {
  akBorderRadius,
  akColorN40,
  akColorN300,
  akColorN800,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const Content: ComponentClass<HTMLAttributes<{}>> = styled.div`
  & div.toolsDrawer {
    margin-top: 16px;
    padding: 8px 16px;
    background: ${akColorN800};

    & label {
      display: flex;
      color: white;
      align-self: center;
      padding-right: 8px;
    }

    & > div {
      /* padding: 4px 0; */
    }

    & button {
      margin: 4px 0;
    }
  }

  & legend {
    margin: 8px 0;
  }

  & input {
    font-size: 13px;
  }
`;

// tslint:disable-next-line:variable-name
export const ButtonGroup: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;

  & > button {
    margin-left: ${akGridSizeUnitless / 2}px;
  }
`;
