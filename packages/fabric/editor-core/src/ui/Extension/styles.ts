import styled from 'styled-components';
import {
  akColorN20A,
  akColorN20,
  akColorB200,
  akColorN70,
  akBorderRadius,
} from '@atlaskit/util-shared-styles';

export const padding = 8;

// tslint:disable-next-line:variable-name
export const Wrapper = styled.div`
  background: ${akColorN20};
  border-radius: ${akBorderRadius};
  position: relative;
  vertical-align: middle;

  .ProseMirror-selectednode > & > .extension-overlay {
    border: 2px solid ${akColorB200};
    top: -2px;
    left: -2px;
    opacity: 1;
  }

  &.with-overlay {
    .extension-overlay {
      background: ${akColorN20A};
    }

    &:hover .extension-overlay {
      opacity: 1;
    }
  }
`;

// tslint:disable-next-line:variable-name
export const Overlay = styled.div`
  border-radius: ${akBorderRadius};
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 1;
`;

// tslint:disable-next-line:variable-name
export const PlaceholderFallback = styled.div`
  display: inline-flex;
  align-items: center;
`;

// tslint:disable-next-line:variable-name
export const PlaceholderFallbackParams = styled.span`
  display: inline-block;
  width: 200px;
  margin-left: 5px;
  color: ${akColorN70};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
