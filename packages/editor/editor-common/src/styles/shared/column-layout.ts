// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';

const columnLayoutSharedStyle = css`
  [data-layout-section] {
    display: flex;
    flex-direction: row;
    & > * {
      flex: 1;
    }
  }
`;

export { columnLayoutSharedStyle };
