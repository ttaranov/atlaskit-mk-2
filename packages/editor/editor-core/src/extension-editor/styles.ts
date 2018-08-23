import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';

import {
  akColorB100,
  akColorN20,
  akColorN100,
} from '@atlaskit/util-shared-styles';

// export const Meta: ComponentClass<HTMLAttributes<{}>> = styled.div`
//   color: ${akColorN100};
//   margin-top: 5px;
//   font-size: 90%;
// `;

// export const Header: ComponentClass<HTMLAttributes<{}>> = styled.h2`
//   font-weight: normal;
//   margin: 0;
// `;

export const ExtensionEditorContainer: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  padding: 40px;
  min-width: 280px;
  position: fixed;
  height: 100vh;
  z-index: 100000;
  background: white;
  right: 0;
  top: 0;
  border-left: 1px solid #efefef;
  box-shadow: -2px 0px 10px 2px rgba(9, 30, 66, 0.12);
  border-top: 2px solid #efefef;
  transition: 1s ease-in;

  label {
    color: ${akColorN100};
  }

  h1 {
    margin: 10px 0;
    text-transform: capitalize;
    font-size: 130%;
  }
  .submit-btn {
    margin-top: 20px;
  }

  .remove-option {
    font-size: 12px;
    padding: 0;
  }
`;

export const FormWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  .options {
    margin: 20px 0;
  }
`;
