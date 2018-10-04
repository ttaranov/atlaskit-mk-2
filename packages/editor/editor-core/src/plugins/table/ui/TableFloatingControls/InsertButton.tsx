import * as React from 'react';
import { TableCssClassName as ClassName } from '../../types';

export interface ButtonProps {
  type: 'row' | 'column';
  insertLineStyle?: object;
  onClick: () => void;
}

const InsertButton = ({ onClick, insertLineStyle, type }: ButtonProps) => (
  <div
    className={`${ClassName.CONTROLS_INSERT_BUTTON_WRAP} ${
      type === 'row'
        ? ClassName.CONTROLS_INSERT_ROW
        : ClassName.CONTROLS_INSERT_COLUMN
    }`}
  >
    <div className={ClassName.CONTROLS_INSERT_BUTTON_INNER}>
      <button
        type="button"
        className={ClassName.CONTROLS_INSERT_BUTTON}
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
              d="M13 11V7a1 1 0 0 0-2 0v4H7a1 1 0 0 0 0 2h4v4a1 1 0 0 0 2 0v-4h4a1 1 0 0 0 0-2h-4z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </span>
      </button>
    </div>
    <div className={ClassName.CONTROLS_INSERT_LINE} style={insertLineStyle} />
    <div className={ClassName.CONTROLS_INSERT_MARKER} />
  </div>
);

export default InsertButton;
