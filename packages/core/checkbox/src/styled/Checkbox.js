// @flow
import styled, { css } from 'styled-components';
import { colors, themed } from '@atlaskit/theme';

export const HiddenCheckbox = styled.input`
  left: 50%;
  margin: 0;
  opacity: 0;
  padding: 0;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
`;

const disabledColor = themed({ light: colors.N80, dark: colors.N80 });

type LabelProps = {
  isDisabled: boolean,
  isFullWidth: boolean,
};

export const Label = styled.label`
  align-items: flex-start;
  display: flex;
  color: ${(props: LabelProps): string =>
    // $FlowFixMe - theme is not found in props
    props.isDisabled ? disabledColor(props) : colors.text(props)};
  ${({ isDisabled }: LabelProps) =>
    isDisabled
      ? css`
          cursor: not-allowed;
        `
      : ''};
`;

type IconWrapperProps = {
  isActive: boolean,
  isChecked: boolean,
  isDisabled: boolean,
  isFocused: boolean,
  isInvalid: boolean,
};

const borderColor = themed({ light: colors.N40, dark: colors.DN80 });
const focusBorder = css`
  stroke: ${themed({ light: colors.B100, dark: colors.B75 })};
  stroke-width: 2px;
`;
const invalidBorder = css`
  stroke: ${themed({ light: colors.R300, dark: colors.R300 })};
  stroke-width: 2px;
`;
const activeBorder = css`
  stroke: currentColor;
  stroke-width: 2px;
`;
const checkedBorder = css`
  stroke: currentColor;
  stroke-width: 2px;
`;
const border = css`
  stroke: ${({ isHovered, ...rest }) =>
    isHovered
      ? themed({ light: colors.N40, dark: colors.DN200 })(rest)
      : borderColor(rest)};
  stroke-width: 2px;
`;

const getBorderColor = (props: IconWrapperProps) => {
  if (props.isDisabled) return '';
  if (props.isFocused) return focusBorder;
  if (props.isActive) return activeBorder;
  if (props.isInvalid) return invalidBorder;
  if (props.isChecked) return checkedBorder;
  return border;
};

const getTickColor = props => {
  const { isChecked, isDisabled, isActive, ...rest } = props;

  let color = themed({ light: colors.N10, dark: colors.DN10 });

  if (isDisabled && isChecked) {
    color = themed({ light: colors.N70, dark: colors.DN90 });
  } else if (isActive && isChecked && !isDisabled) {
    color = themed({ light: colors.B400, dark: colors.DN10 });
  } else if (!isChecked) {
    color = themed({ light: 'transparent', dark: 'transparent' });
  }
  return color(rest);
};

const getBoxColor = props => {
  const { isChecked, isDisabled, isActive, isHovered, ...rest } = props;
  // set the default
  let color = themed({ light: colors.N10, dark: colors.DN10 });

  if (isDisabled) {
    color = themed({ light: colors.N20, dark: colors.DN10 });
  } else if (isActive) {
    color = themed({ light: colors.B50, dark: colors.B200 });
  } else if (isHovered && isChecked) {
    color = themed({ light: colors.B300, dark: colors.B75 });
  } else if (isHovered) {
    color = themed({ light: colors.N30, dark: colors.DN30 });
  } else if (isChecked) {
    color = themed({ light: colors.B400, dark: colors.B400 });
  }
  return color(rest);
};

export const LabelText = styled.span`
  padding: 2px 4px;
`;

export const CheckboxWrapper = styled.span`
  display: flex;
  flex-shrink: 0;
  position: relative;
`;

export const IconWrapper = styled.span`
  line-height: 0;
  flex-shrink: 0;
  color: ${getBoxColor};
  fill: ${getTickColor};
  transition: all 0.2s ease-in-out;

  /* This is adding a property to the inner svg, to add a border to the checkbox */
  & rect:first-child {
    transition: stroke 0.2s ease-in-out;
    ${getBorderColor};
  }
`;
