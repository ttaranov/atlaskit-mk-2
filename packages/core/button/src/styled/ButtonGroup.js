// @flow
import styled from 'styled-components';

const gutter = 4;

export default styled.div`
  display: inline-flex;
  margin: 0 -${gutter / 2}px;
`;

export const GroupItem = styled.div`
  flex: 1 0 auto;
  margin: 0 ${gutter / 2}px;
`;
