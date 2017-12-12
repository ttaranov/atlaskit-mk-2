import styled from 'styled-components';
import { Layout } from '@atlaskit/editor-common';

function float(layout: Layout): string {
  switch (layout) {
    case 'wrap-right':
      return 'right';
    case 'wrap-left':
      return 'left';
    default:
      return 'none';
  }
}

function clear(layout: Layout): string {
  switch (layout) {
    case 'wrap-right':
      return 'right';
    case 'wrap-left':
      return 'left';
    default:
      return 'both';
  }
}

function textAlign(layout: Layout): string {
  switch (layout) {
    case 'wide':
    case 'full-width':
    case 'center':
      return 'center';
    default:
      return 'left';
  }
}

export interface WrapperProps {
  layout: Layout;
}

// tslint:disable-next-line:variable-name
export const Wrapper = styled.div`
  padding-bottom: 8px;
  display: block;
  ${({ layout }: WrapperProps) => {
    return `
      float: ${float(layout)};
      clear: ${clear(layout)};
      text-align: ${textAlign(layout)};
    `;
  }};

  & > * {
    padding: 5px 10px 0 0;
  }
`;
