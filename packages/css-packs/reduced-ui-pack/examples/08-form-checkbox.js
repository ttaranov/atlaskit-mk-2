// @flow
import React from 'react';
import '../src/index.less';

export default () => (
  <form onSubmit={e => e.preventDefault()}>
    <h2>Settings</h2>
    <fieldset className="ak-field-group">
      <legend>
        <span>Account options</span>
      </legend>
      <div className="ak-field-checkbox">
        <input type="checkbox" name="option1" id="option1" value="option1" />
        <label htmlFor="option1">Keep me logged in</label>
      </div>
      <div className="ak-field-checkbox">
        <input
          type="checkbox"
          name="option2"
          id="option2"
          value="option2"
          defaultChecked
        />
        <label htmlFor="option2">Check for updates automatically</label>
      </div>
      <div className="ak-field-checkbox">
        <input
          type="checkbox"
          name="option3"
          id="option3"
          value="option3"
          defaultChecked
          disabled
        />
        <label htmlFor="option3">Enable two-factor authentication</label>
      </div>
    </fieldset>
    <div className="ak-field-group">
      <button className="ak-button ak-button__appearance-primary">Save</button>
    </div>
  </form>
);
