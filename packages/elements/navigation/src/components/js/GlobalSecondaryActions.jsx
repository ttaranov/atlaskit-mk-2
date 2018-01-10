import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export const maxSecondaryItems = 5;

function checkIfTooManySecondaryActions(actions = []) {
  if (actions.length > maxSecondaryItems) {
    // eslint-disable-next-line no-console
    console.warn(`AkGlobalNavigation will only render up to ${maxSecondaryItems} secondary actions.`);
  }
}

export default class GlobalSecondaryActions extends PureComponent {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.node).isRequired,
  }

  constructor(props, context) {
    super(props, context);
    checkIfTooManySecondaryActions(props.actions);
  }

  componentWillReceiveProps(nextProps) {
    checkIfTooManySecondaryActions(nextProps.actions);
  }

  render() {
    return (
      <div>
        {this.props.actions.map((action, index) => (
          index < maxSecondaryItems ? <div key={index}>{action}</div> : null
        ))}
      </div>
    );
  }
}
