import styled from 'styled-components';
import { akColorN300, akColorN800 } from '@atlaskit/util-shared-styles';
import { ellipsis } from '../../../../styles';

export const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  margin: 0 -4px;

  & > * {
    margin: 4px;
  }
`;

export const WidgetWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  max-width: calc(100% - (2 * 8px));
`;

export const WidgetDetails = styled.div`
  display: flex;
  align-items: center;

  /* space the widget items */
  & > * + * {
    margin-left: 2px;
  }
`;

export const Title = styled.div`
  color: ${akColorN300};
  font-size: 12px;
  line-height: ${() => 16 / 12};
`;

export const Text = styled.div`
  ${ellipsis('none')};
  color: ${akColorN800};
  font-size: 12px;
  line-height: ${() => 16 / 12};
`;
