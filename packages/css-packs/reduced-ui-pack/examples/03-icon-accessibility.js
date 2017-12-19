// @flow

import React from 'react';
// eslint-disable-next-line
import icons from '!!raw-loader!../dist/icons-sprite.svg';
// eslint-disable-next-line
import reducedStyles from '!!raw-loader!../src/bundle.css';

// eslint-disable-next-line react/no-danger
const Spritemap = () => <div dangerouslySetInnerHTML={{ __html: icons }} />;

export default () => (
  <div>
    <style>{reducedStyles}</style>
    <Spritemap />
    <div className="ak-field-group">
      <label htmlFor="dummy">Dummy input</label>
      <input
        type="text"
        className="ak-field-text ak-field__size-medium"
        id="dummy"
        placeholder="Focus on this field then tab to the button"
      />
    </div>
    <p>
      <button type="button" className="ak-button ak-button__appearance-default">
        <svg focusable="false" className="ak-icon" aria-label="Add">
          <use xlinkHref="#ak-icon-add" />
        </svg>
      </button>
    </p>
  </div>
);
