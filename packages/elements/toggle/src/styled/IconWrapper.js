// @flow
import styled from 'styled-components';
import { themed, colors } from '@atlaskit/theme';
import { getWidth, paddingUnitless } from './constants';

const iconPadding = `${paddingUnitless / 2}px`;

const getPadding = ({ isChecked }) =>
  isChecked
    ? `
    padding-left: ${iconPadding};
    padding-right: 0;
  `
    : `
    padding-left: 0;
    padding-right: ${iconPadding};
  `;

export default styled.div`
  display: flex;
  max-width: ${props => getWidth(props) / 2}px;
  align-items: center;
  ${getPadding};
  color: ${themed({ light: 'inherit', dark: colors.DN30 })};
`;
