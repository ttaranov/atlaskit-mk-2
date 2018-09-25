import * as React from 'react';

export interface ButtonProps {
  type: 'row' | 'column';
  insertLineStyle?: object;
  onClick: () => void;
}

const InsertButton = ({ onClick, insertLineStyle, type }: ButtonProps) => (
  <div
    className={`pm-table-controls__insert-button-wrap pm-table-controls__insert-${type}`}
  >
    <div className="pm-table-controls__insert-button-inner">
      <button
        type="button"
        className="pm-table-controls__insert-button"
        onClick={onClick}
      >
        <span className="pm-button-icon">
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
    <div className="pm-table-controls__insert-line" style={insertLineStyle} />
    <div className="pm-table-controls__insert-marker" />
  </div>
);

export default InsertButton;
