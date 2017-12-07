import React from 'react';
/* eslint-disable import/no-duplicates, import/first */
import ButtonAppearances from './ButtonAppearances';
import buttonAppearancesSrc from '!raw-loader!./ButtonAppearances';
import ButtonOptions from './ButtonOptions';
import buttonOptionsSrc from '!raw-loader!./ButtonOptions';
import ButtonSpacing from './ButtonSpacing';
import buttonSpacingSrc from '!raw-loader!./ButtonSpacing';
import ButtonGroupExample from './ButtonGroupExample';
import buttonGroupExampleSrc from '!raw-loader!./ButtonGroupExample';
/* eslint-enable import/no-duplicates, import/first */

export const description = (
  <div>
    <p>
      Buttons are used as triggers for actions. They are used in forms,
      toolbars, dialog footers and as stand-alone action triggers.
    </p>
    <p>
      Button also exports a button-group component to make it easy to display
      multiple buttons together.
    </p>
  </div>
);

export const examples = [
  {
    title: 'Appearance Options',
    Component: ButtonAppearances,
    src: buttonAppearancesSrc,
  },
  {
    title: 'Spacing Options',
    Component: ButtonSpacing,
    src: buttonSpacingSrc,
  },
  {
    title: 'Other Options',
    Component: ButtonOptions,
    src: buttonOptionsSrc,
  },
  {
    title: 'Example of ButtonGroup',
    Component: ButtonGroupExample,
    src: buttonGroupExampleSrc,
  },
];
