// @flow
import { css } from 'styled-components';

const isLoadingStyle = css`
  transition: opacity 0.3s;
  opacity: ${({ isLoading }) => (isLoading ? 0 : 1)};
`;

const getLoadingStyle = ({ isLoading }: { isLoading?: boolean }) => ({
  transition: 'opacity 0.3s',
  opacity: isLoading ? 0 : 1,
});

export { isLoadingStyle, getLoadingStyle };
