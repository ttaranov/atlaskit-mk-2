// @flow

import React from 'react';
import { Prop } from 'pretty-proptypes'; // TODO export this from @atlaskit/docs
import { Example, md, Props } from '@atlaskit/docs';
import { colors } from '@atlaskit/theme';

import { Contents, ContentsProvider, H } from './shared';

const Hr = () => (
  <hr
    css={{
      backgroundColor: colors.N40,
      border: 0,
      height: 1,
      marginBottom: '2em',
      marginTop: '2em',
    }}
  />
);

export default (
  <ContentsProvider>{md`
${<Contents />}

${<Hr />}

${<H>ContainerHeader</H>}

The ContainerHeader is intended to be used in the container navigation layer for a project, space, etc. It is essentially an Item with some custom styles applied to it and has an almost identical props interface. The only difference is that the ContainerHeader does not accept a spacing prop.

${(
    <Example
      Component={require('./examples/ui-components/ContainerHeader').default}
      title="ContainerHeader"
      source={require('!!raw-loader!./examples/ui-components/ContainerHeader')}
    />
  )}

## ContainerHeader props

See [Item](#Item).

&nbsp;

${<Hr />}

${<H>GlobalItem</H>}

GlobalItems are rendered inside the global navigation layer.

${(
    <Example
      Component={require('./examples/ui-components/GlobalItem').default}
      title="GlobalItem"
      source={require('!!raw-loader!./examples/ui-components/GlobalItem')}
    />
  )}

${(
    <Props
      heading="GlobalItem props"
      props={require('!!extract-react-types-loader!../src/components/GlobalItem')}
    />
  )}

${<Hr />}

${<H>GlobalNav</H>}

If you're building an Atlassian product you probably don't want to use this component directly. Please take a look at the @atlaskit/global-navigation component instead.

The GlobalNav component is a primitive layout component which renders GlobalItems into one of two slots.

${(
    <Props
      heading="GlobalNav props"
      props={require('!!extract-react-types-loader!../src/components/GlobalNav')}
    />
  )}

${<Hr />}

${<H>Group</H>}

A useful component for rendering a group of Items with a heading and a separator. The heading and separator will only be rendered if the Group has children.

A section of the product or container navigation may contain multiple groups.

${(
    <Example
      Component={require('./examples/ui-components/Group').default}
      title="Group"
      source={require('!!raw-loader!./examples/ui-components/Group')}
    />
  )}

${(
    <Props
      heading="Group props"
      props={require('!!extract-react-types-loader!../src/components/Group')}
    />
  )}

${<Hr />}

${<H>GroupHeading</H>}

The heading for a group of items.

${(
    <Props
      heading="GroupHeading props"
      props={require('!!extract-react-types-loader!../src/components/GroupHeading')}
    />
  )}

${<Hr />}

${<H>Item</H>}

${(
    <Example
      Component={require('./examples/ui-components/Item').default}
      title="Item"
      source={require('!!raw-loader!./examples/ui-components/Item')}
    />
  )}

${(
    <Props
      heading="Item props"
      props={require('!!extract-react-types-loader!../src/components/Item')}
    />
  )}

${<Hr />}

${<H>ItemAvatar</H>}

The ItemAvatar is a useful wrapper around Atlaskit's Avatar component, which will update its background color based on the state of the Item that it's in. It's intended to be used inside the before or after props of an Item, and you need to pass through the provided item state.

${(
    <Props
      heading="ItemAvatar props"
      props={require('!!extract-react-types-loader!../src/components/ItemAvatar')}
    />
  )}

${<Hr />}

${<H>LayoutManager</H>}

The LayoutManager is the entrypoint to navigation. It is in charge of laying out the global, product, and container layers of navigation, along with your page content. Read the [Getting Started guide](/packages/core/navigation-next/docs/composing-your-navigation) for for information.

${(
    <Props
      heading="LayoutManager props"
      props={require('!!extract-react-types-loader!../src/components/LayoutManager')}
    />
  )}

${<Hr />}

${<H>Section</H>}

The product or container navigation layers can be separated into Sections - a navigation is essentially a flat array of Sections. Within a Section, use Groups for further levels of division.

Use Sections to perform nesting transitions. If a Section's props update and its parentId matches its previous id, or vice versa, it will automatically perform a nested navigation animation as it re-renders.

${(
    <Example
      Component={require('../examples/30-section').default}
      title="Section"
      source={require('!!raw-loader!../examples/30-section')}
    />
  )}

${(
    <Props
      heading="Section props"
      props={require('!!extract-react-types-loader!../src/components/Section')}
    />
  )}

${<Hr />}

${<H>Separator</H>}

Separates a group of items. This component takes no props.

${<Hr />}

<a name="Switcher"></a>
# Switcher

The Switcher component should be used within container navigation for switching projects or boards.

It's recommended that the value be derived from the URL for accessibility, and to make updates via browser's history API \`onChange\`.

${(
    <Example
      Component={require('./examples/ui-components/Switcher').default}
      title="Switcher"
      source={require('!!raw-loader!./examples/ui-components/Switcher')}
    />
  )}

${(
    <Props
      heading="Switcher props"
      props={require('!!extract-react-types-loader!../src/components/Switcher')}
      overrides={{
        // NOTE remove horrible (aesthetically) default value from docs
        // it's not really relevant to the consumer.
        // eslint-disable-next-line react/prop-types
        components: ({ defaultValue, ...props }) => <Prop {...props} />,
      }}
    />
  )}
`}</ContentsProvider>
);
