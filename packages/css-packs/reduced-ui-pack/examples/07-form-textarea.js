// @flow
import React from 'react';
// eslint-disable-next-line
import reducedStyles from '!!raw-loader!../src/bundle.css';

export default () => (
  <form onSubmit={e => e.preventDefault()}>
    <style>{reducedStyles}</style>
    <h2>Add a comment</h2>
    <div className="ak-field-group">
      <label htmlFor="description">Comment</label>
      <textarea
        className="ak-field-textarea"
        rows="5"
        id="comment"
        name="comment"
      />
    </div>
    <div className="ak-field-group">
      <button className="ak-button ak-button__appearance-primary">
        Add comment
      </button>
    </div>
  </form>
);
