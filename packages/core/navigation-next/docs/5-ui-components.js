// @flow

import React from 'react';
import { Example, md, Props } from '@atlaskit/docs';

export default md`
# ContainerHeader

The ContainerHeader is intended to be used in the container navigation layer for a project, space, etc. It is essentially an Item with some custom styles applied to it and has an almost identical props interface. The only difference is that the ContainerHeader does not accept a spacing prop.

${(
  <Example
    Component={
      require('../examples/docs/ui-components/ContainerHeader').default
    }
    title="ContainerHeader"
    source={require('!!raw-loader!../examples/docs/ui-components/ContainerHeader')}
  />
)}

## ContainerHeader props

See Item.

# GlobalItem

The GlobalItem is rendered inside the global navigation layer.

${(
  <Example
    Component={require('../examples/docs/ui-components/GlobalItem').default}
    title="GlobalItem"
    source={require('!!raw-loader!../examples/docs/ui-components/GlobalItem')}
  />
)}

${(
  <Props
    heading="GlobalItem props"
    props={require('!!extract-react-types-loader!../src/components/GlobalItem')}
  />
)}

# GlobalNav

If you're building an Atlassian product you probably don't want to use this component directly. Please take a look at the @atlaskit/global-navigation component instead.

The GlobalNav component is a primitive layout component which renders GlobalItems into one of two slots.

${(
  <Props
    heading="GlobalNav props"
    props={require('!!extract-react-types-loader!../src/components/GlobalNav')}
  />
)}

# Group

A useful component for rendering a group of Items with a heading and a separator. The heading and separator will only be rendered if the Group has children.

A section of the product or container navigation may contain multiple groups.

${(
  <Example
    Component={require('../examples/docs/ui-components/Group').default}
    title="Group"
    source={require('!!raw-loader!../examples/docs/ui-components/Group')}
  />
)}

${(
  <Props
    heading="Group props"
    props={require('!!extract-react-types-loader!../src/components/Group')}
  />
)}

# GroupHeading

The heading for of a group of items.

${(
  <Props
    heading="GroupHeading props"
    props={require('!!extract-react-types-loader!../src/components/GroupHeading')}
  />
)}

# Item

${(
  <Props
    heading="Item props"
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

# LayoutManager

The LayoutManager is the entrypoint to navigation. It is in charge of laying out the global, product, and container layers of navigation, along with your page content. Read the Getting Started guide for for information.

${(
  <Props
    heading="LayoutManager props"
    props={require('!!extract-react-types-loader!../src/components/LayoutManager')}
  />
)}

# Section

The product or container navigation layers can be separated into Sections - a navigation is essentially a flat array of Sections. Within a Section, use Groups for further levels of division.

${(
  <Props
    heading="Section props"
    props={require('!!extract-react-types-loader!../src/components/Section')}
  />
)}

# Separator

Separates a group of items. This component takes no props.
`;
