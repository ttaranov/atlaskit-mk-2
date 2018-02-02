import styled from 'styled-components';
import { akBorderRadius } from '@atlaskit/util-shared-styles';
import { scrollableMaxHeight } from '../../shared-styles';

// tslint:disable:next-line variable-name
export const ScrollableStyle = styled.div`
  display: block;
  overflow-x: hidden;
  overflow-y: auto;

  padding: 4px 0;
  margin: 0;

  background: white;
  max-height: ${scrollableMaxHeight};

  border-radius: ${akBorderRadius};
`;
