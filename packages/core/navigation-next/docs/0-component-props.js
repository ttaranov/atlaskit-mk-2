// @flow

import React from 'react';
import { md, Props } from '@atlaskit/docs';
import { colors } from '@atlaskit/theme';

const Warning = p => (
  <div
    style={{
      backgroundColor: colors.Y75,
      boxShadow: `-4px 0 0 ${colors.Y200}`,
      marginBottom: '1.4em',
      padding: '1em 1.2em',
    }}
    {...p}
  />
);
export default md`
${(
  <Warning>
    <p>
      <strong>
        Note: @atlaskit/navigation-next is currently a developer preview.
      </strong>
    </p>
    <p>
      Please experiment with and test this package, but be aware that the API
      may change at any time. Use at your own risk, preferrably not in
      production.
    </p>
  </Warning>
)}

# UI component props

${
  // <Props
  //   heading="ContainerHeader"
  //   props={require('!!extract-react-types-loader!../src/components/ContainerHeader')}
  // />
  null
}

${(
  <Props
    heading="GlobalItem"
    props={require('!!extract-react-types-loader!../src/components/GlobalItem')}
  />
)}

${(
  <Props
    heading="GlobalNav"
    props={require('!!extract-react-types-loader!../src/components/GlobalNav')}
  />
)}

${(
  <Props
    heading="Item"
    props={require('!!extract-react-types-loader!../src/components/Item')}
  />
)}

${
  // <Props
  //   heading="ItemAvatar"
  //   props={require('!!extract-react-types-loader!../src/components/ItemAvatar')}
  // />
  null
}

${
  (
    <Props
      heading="LayoutManager"
      props={require('!!extract-react-types-loader!../src/components/LayoutManager')}
    />
    // null
  )
}

${(
  <Props
    heading="Section"
    props={require('!!extract-react-types-loader!../src/components/Section')}
  />
)}

${(
  <Props
    heading="Separator"
    props={require('!!extract-react-types-loader!../src/components/Separator')}
  />
)}

${(
  <Props
    heading="GroupHeading"
    props={require('!!extract-react-types-loader!../src/components/GroupHeading')}
  />
)}
`;
