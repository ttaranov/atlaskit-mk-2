import { ComponentClass } from 'react';
import {
  akColorB300,
  akColorB400,
  akColorN800,
  akColorN40,
  akColorN300,
  akColorN30A,
  akGridSizeUnitless,
  akTypographyMixins,
  akFontFamily,
  akFontSizeDefault,
} from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const Wrapper: ComponentClass<any> = styled.div`
  color: ${akColorN800};

  & span.akActionMark {
    color: ${akColorB400};
    text-decoration: none;

    &:hover {
      color: ${akColorB300};
      text-decoration: underline;
    }
  }

  & span.akActionMark {
    cursor: pointer;
  }

  & blockquote {
    margin: ${akGridSizeUnitless * 1.5}px 0 0 0;
    color: ${akColorN300};
    border-left: 2px solid ${akColorN40};
    padding-left: ${akGridSizeUnitless * 2}px;

    & :first-child {
      margin-top: 0;
    }

    & > :last-child {
      display: inline-block;
    }

    &::before {
      content: '';
    }

    &::after {
      content: '';
    }
  }

  & p {
    font-family: ${akFontFamily};
    font-size: ${akFontSizeDefault};
    font-weight: 400;
    line-height: 24px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  & ul {
    list-style-type: disc;

    & ul {
      list-style-type: circle;
    }

    & ul ul {
      list-style-type: square;
    }
  }

  & ol {
    list-style-type: decimal;

    & ol {
      list-style-type: lower-alpha;
    }

    & ol ol {
      list-style-type: lower-roman;
    }

    & ol ol ol {
      list-style-type: decimal;
    }

    & ol ol ol ol {
      list-style-type: lower-alpha;
    }

    & ol ol ol ol ol {
      list-style-type: lower-roman;
    }

    & ol ol ol ol ol ol {
      list-style-type: decimal;
    }

    & ol ol ol ol ol ol ol {
      list-style-type: lower-alpha;
    }

    & ol ol ol ol ol ol ol ol {
      list-style-type: lower-roman;
    }
  }

  & .akTaskList > ol,
  & .akDecisionList > ol {
    list-style-type: none;
  }

  & h1 {
    ${akTypographyMixins.h800};
    &:first-child {
      margin-top: 0;
    }
  }

  & h2 {
    ${akTypographyMixins.h700};
    &:first-child {
      margin-top: 0;
    }
  }

  & h3 {
    ${akTypographyMixins.h600};
    &:first-child {
      margin-top: 0;
    }
  }

  & h4 {
    ${akTypographyMixins.h500};
    &:first-child {
      margin-top: 0;
    }
  }

  & h5 {
    ${akTypographyMixins.h400};
    &:first-child {
      margin-top: 0;
    }
  }

  & h6 {
    ${akTypographyMixins.h300};
    &:first-child {
      margin-top: 0;
    }
  }

  & hr {
    border: none;
    background-color: ${akColorN30A};
    height: 2px;
    border-radius: 1px;
  }

  & img {
    max-width: 100%;
  }
`;
