// @flow

import { code, md } from '@atlaskit/docs';

export default md`
This guide will introduce you to many of the components exported by \`@atlaskit/navigation-next\`, and will walk you through composing a simple navigation.

### Contents

1. [The LayoutManager component](#the-layoutmanager-component)
2. [Configuring the global navigation](#configuring-the-global-navigation)
3. [Composing the product navigation](#composing-the-product-navigation)
4. [Composing the container navigation](#composing-the-container-navigation)
5. [Managing the UI state](#managing-the-ui-state)
6. [Theming](#theming)

<a name="the-layoutmanager-component"></a>
## The LayoutManager component

If you've read the Conceptual Model documentation you'll understand that the user interface of an Atlassian application is made up of a series of metaphorical 'layers'. These are, in order from lowest to highest, the global layer, the product layer, the container layer, and the page layer.

We handle the placement and positioning of these layers using a component called the \`LayoutManager\`, which is essentially the entrypoint to \`@atlaskit/navigation-next\`. \`LayoutManager\` takes the following props:

${code`
{
  /** A component which will render the global navigation layer. */
  globalNavigation: ComponentType<{}>,
  /** A component which will render the product navigation layer. */
  productRootNavigation: ComponentType<{}>,
  /** A component which will render the container navigation layer. */
  productContainerNavigation: ?ComponentType<{}>,
  /** The page layer. */
  children: Node,
}
`}

The \`LayoutManager\` will position these layers and handle UI state concerns such as resizing, collapsing, peeking, etc. out of the box. This state container can be accessed via context and we will explore how this works later on. For now, it means we'll need one more component before we can render anything - the \`NavigationProvider\`. With this, we can render the bare bones of an Atlassian application:

&nbsp;

<iframe src="https://codesandbox.io/embed/995jow9vp?fontsize=12&module=%2Fsrc%2FApp.js&view=editor" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<a name="configuring-the-global-navigation"></a>
## Configuring the global navigation

As we begin composing the navigation we might as well start at the bottom - the global layer. Conceptually this layer universal across every Atlassian product. In practice there will be some product-specific items in this area, and some of the actions will be contextual, but for the most part our customers should get a very consistent experience here no matter what Atlassian product they're using. To facilitate this consistency we provide a pre-configured \`@atlaskit/global-navigation\` component which accepts a simple set of props and will compose the global navigation layer for you. You can find the full props interface in the documentation for that component, but for now let's simply render the product icon.

${code`
import GlobalNavigation from '@atlaskit/global-navigation';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';

const MyGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={AtlassianIcon}
    onProductClick={() => {}}
  />
);
`}

We can then plug this component into our \`LayoutManager\` to render the global layer.

&nbsp;

<iframe src="https://codesandbox.io/embed/m3r4jz91l9?fontsize=12&module=%2Fsrc%2FApp.js&view=editor" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<a name="composing-the-product-navigation"></a>
## Composing the product navigation

Let's move on to the next part of our navigation - the product area. This area will always contain the product layer. Depending on the part of the application we're in there may also be a container layer as well. The \`productContainerNavigation\` prop is nullable, so we'll remove it for now. We'll also create a component to render something in the product area.

We can render basically anything we want in this section. All of the typical primitive UI components are provided by \`@atlaskit/navigation-next\` so let's start putting a few of these together.

${code`
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { AtlassianWordmark } from '@atlaskit/logo';
import { Item, Section, SectionTitle, SectionSeparator } from '@atlaskit/navigation-next';

const ProductNavigationWrapper = styled.div({ padding: '16px 0' });

const MyProductNavigation = () => (
  <ProductNavigationWrapper>
    <Section>
      {({ className }) => (
        <div className={className}>
          <AtlassianWordmark />
        </div>
      )}
    </Section>
    <Section>
      {({ className }) => (
        <div className={className}>
          <Item text="Dashboard" />
          <Item text="Things" />
          <Item text="Settings" />
          <SectionSeparator />
          <SectionTitle>Add-ons</SectionTitle>
          <Item text="My plugin" />
        </div>
      )}
    </Section>
  </ProductNavigationWrapper>
);
`}

**Note:** We don't automatically apply padding or add wrapping elements around your product navigation or within \`Section\`s because we don't want to break your layout. Instead, we provide the \`Section\`'s children with styles through a render function.

Read the Component docs for more information about the \`Section\`, along with every other UI primitive exported by this package.

Putting it all together we can now render a somewhat complete navigation!

&nbsp;
<iframe src="https://codesandbox.io/embed/8ywxz261p2?fontsize=12&module=%2Fsrc%2FApp.js&view=editor" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<a name="composing-the-container-navigation"></a>
## Composing the container navigation

The container layer can be composed using the same primitives as the product layer. Let's add a few items to it so that we can see the full navigation in action.

&nbsp;
<iframe src="https://codesandbox.io/embed/qvzzy71m46?fontsize=12&module=%2Fsrc%2FApp.js&view=editor" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<a name="managing-the-ui-state"></a>
## Managing the UI state

If you try you'll notice that you can expand, collapse, and resize your navigation right now, and this state will be controlled by the component. What if we want to manage or respond to this state somewhere in our application? Introducing the \`UIStateSubscriber\`.

${code`
import { NavigationSubscriber } from '@atlaskit/navigation-next';

const ExpandToggleButton = () => (
  <NavigationSubscriber>
    {ui => (
      <button onClick={ui.toggleProductNav}>
        {ui.state.productNavIsCollapsed ? 'Expand' : 'Collapse'} product navigation
      </button>
    )}
  </NavigationSubscriber>
);
`}

This component provides its children with access to the state of the navigation, along with methods which can be called to modify the state. It will re-render whenever the state changes. This container manages behaviours such as collapsing/expanding, peeking, peek hinting, and resizing. Read the component's documentation for a complete list of methods and properties.

&nbsp;
<iframe src="https://codesandbox.io/embed/my9lj0kpl8?fontsize=12&module=%2Fsrc%2FApp.js&view=editor" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<a name="theming"></a>
## Theming

The current implementation of theming in \`@atlaskit/navigation-next\` is experimental and is likely to change soon. We'll add documentation and guides once the API has stabilised.
`;
