import * as React from 'react';
import { TableCssClassName as ClassName } from '../../types';

export interface ButtonProps {
  style?: object;
  onClick?: () => void;
  onMouseEnter?: (SyntheticEvent) => void;
  onMouseLeave?: (SyntheticEvent) => void;
}

const DeleteButton = ({
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: ButtonProps) => (
  <div
    className={ClassName.CONTROLS_DELETE_BUTTON_WRAP}
    style={style}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <button
      type="button"
      className={ClassName.CONTROLS_DELETE_BUTTON}
      onClick={onClick}
    >
      <span className={ClassName.CONTROLS_BUTTON_ICON}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          focusable="false"
          role="presentation"
        >
          <path
            d="M12 10.586L6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 0 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 1 0-1.414-1.414L12 10.586z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  </div>
);

export default DeleteButton;
