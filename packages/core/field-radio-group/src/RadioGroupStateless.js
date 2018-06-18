// @flow
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Base, { Label } from '@atlaskit/field-base';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import Radio from './Radio';
import type { RadioGroupStatelessPropTypes, ItemsPropType } from './types';

type DefaultPropsTypes = {
  isRequired: boolean,
  items: ItemsPropType,
  label: string,
};

export class FieldRadioGroupStateless extends Component<
  RadioGroupStatelessPropTypes,
  void,
> {
  static defaultProps: DefaultPropsTypes = {
    isRequired: false,
    items: [],
    label: '',
  };

  renderItems = (): any => {
    // Check items to avoid flow typing issue
    if (this.props.items) {
      return this.props.items.map((item, index) => (
        <Radio
          key={index}
          isDisabled={item.isDisabled}
          isRequired={this.props.isRequired}
          isSelected={item.isSelected}
          name={item.name}
          onChange={this.props.onRadioChange}
          value={item.value}
        >
          {item.label}
        </Radio>
      ));
    }
    return null;
  };

  render() {
    return (
      <div>
        {/* $FlowFixMe TEMPORARY */}
        <Label label={this.props.label} isRequired={this.props.isRequired} />
        <Base
          appearance="none"
          isRequired={this.props.isRequired}
          label={this.props.label}
        >
          <div aria-label={this.props.label} role="group">
            {this.renderItems()}
          </div>
        </Base>
      </div>
    );
  }
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'field-radio-group',
  packageName: packageName,
  packageVersion: packageVersion,
})(
  withAnalyticsEvents({
    onRadioChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'field-radio-group',

      attributes: {
        packageName: packageName,
        packageVersion: packageVersion,
      },
    }),
  })(FieldRadioGroupStateless),
);
