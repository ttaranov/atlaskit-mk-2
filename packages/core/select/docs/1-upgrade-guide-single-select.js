// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';
import PropChanges from '../docs-util/propChanges';
import { singleSelectPropChanges } from '../docs-util/propChangeData';

export default md`
  # Upgrade Guide

  **@atlaskit/select** aims to align the varying use cases for the previous single-select and multi-select packages
  into one package. In this guide we'll cover the differences that you need to be aware of in **@atlaskit/select**
  for you to update from **@atlaskit/single-select**.

  ## Props

  ${<PropChanges data={singleSelectPropChanges} />}

  ## Options
  We no longer enforce opinions on the shape of your passed in options.
  Previously options had the following shape:

  ~~~
    Array<{
      heading: string
      item: Array<{
        content?: Node,
        description?: string,
        label?: string,
        tooltipDescription?: string,
        tooltipPosition?: 'top' | 'bottom' | 'left',
        value?: string | number,
        filterValues?: Array<string>,
        isDisabled?: boolean,
        isSelected?: boolean,
        elemBefore?: Node,
      }>
  }>
  ~~~

  We've simplified this to the following:
  ~~~
  Array<{
    [any]: string,
    options?: Array<{[any]: string}>
  }>
  ~~~

  By default, we form very few opinions about the shape of your passed in options.
  The only attribute we really force any opinions on, are whether or not your option object has an option property of its own.
  Otherwise, by default we will filter based on the \`value\` property and render the specified \`label\` value.
  However we provide you with a series of props to augment this behaviour at multiple levels of use, please see the \`custom data structures\` section
  for more details.

  While the shape of each item is much less explicit, due to how we expose component customisation, the same functionality that the previous item shape enabled
  can still be achieved, without locking us down to any particular set of opinions.

  ### elemBefore

  ${(
    <Example
      Component={require('../examples/18-element-before').default}
      source={require('!!raw-loader!../examples/18-element-before')}
      title="Element Before example"
    />
  )}

  ### toolTipDescription & tooltipPosition

  ### filterValues

  ### description

`;
