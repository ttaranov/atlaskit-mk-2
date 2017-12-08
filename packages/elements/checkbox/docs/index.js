import React from 'react';
import styled from 'styled-components';

import { colors } from '@atlaskit/theme';

/* eslint-disable import/no-duplicates, import/first */
import BasicUsage from './BasicUsage';
import basicUsageSrc from '!raw-loader!./BasicUsage';
// import BreadcrumbsExpand from './BreadcrumbsExpand';
// import breadcrumbsExpandSrc from '!raw-loader!./BreadcrumbsExpand';
/* eslint-enable import/no-duplicates, import/first */

const Usage = styled.pre`
  background-color: ${colors.codeBlock};
  border-radius: 5px;
  margin: 14px 0;
  padding: 8px;
`;

export const description = (
  <div>
    <p>
      A checkbox element for use in forms and elsewhere. There is a stateful
      default export that manages the checked state of the checkbox, and a
      stateless version that allows you to control changes in the checked state
      directly. There is also a wrapper component to display checkboxes in a
      group.
    </p>
    <Usage>
      {
        "import Checkbox, { CheckboxStateless, CheckboxGroup } from '@atlaskit/checkbox';"
      }
    </Usage>
  </div>
);

export const examples = [
  {
    title: 'Basic Usage',
    Component: BasicUsage,
    src: basicUsageSrc,
  },
  // {
  //   title: 'With maxItems Exceeded',
  //   Component: BreadcrumbsExpand,
  //   src: breadcrumbsExpandSrc,
  // },
];
