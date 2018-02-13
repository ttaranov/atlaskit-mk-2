/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';

export const AvatarListWrapper = styled.div`
  ul {
    display: flex;

    padding: 0;
    margin: 0;

    list-style-type: none;

    li {
      padding-right: 5px;
      margin: 0px;
    }
  }

  // hide tickbox and file type icon in overlay
  // because those are not necessary for avatars

  .tickbox {
    visibility: hidden;
  }

  .file-type-icon {
    visibility: hidden;
  }
`;
