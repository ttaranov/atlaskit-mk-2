// @flow

import React from 'react';
import { code, md } from '@atlaskit/docs';

import { Contents, ContentsProvider, IframeExample, H } from './shared';

export default (
  <ContentsProvider>{md`
This guide will introduce you to some of the more advanced concepts in navigation-next.

${<Contents listType="ol" />}

${<H>Navigation views</H>}

If you've followed the previous guide you'll know how to use the UI components to compose a navigation. This is all well and good if your navigation is simple and will never change as the user navigates around your app. But what if we do want to change the state of our navigation?

We refer to each state the navigation can be in as a 'view'. As an example, here are some of Jira's navigation 'views':

${(
    <IframeExample
      source={require('!!raw-loader!../examples/9999-views-controller-views-example')}
      title="Navigation views"
      url="/examples.html?groupId=core&packageId=navigation-next&exampleId=views-controller-views-example"
    />
  )}

${<H>Representing a view as data</H>}

Representing a view as a Javascript array makes them really easy to work with. Let's start by taking the Product home view above and turning it into JSON.

${code`// Component representation
const componentView = (
  <Fragment>
    <Section key="header">
      {({ className }) => (
        <div className={className}>
          <div css={{ padding: '16px 0' }}>
            <JiraWordmark />
          </div>
        </div>
      )}
    </Section>
    <Section key="menu">
      {({ className }) => (
        <div className={className}>
          <Item before={DashboardIcon} text="Dashboards" />
          <Item before={FolderIcon} text="Projects" />
          <Item before={IssueIcon} text="Issues and filters" />
          <Item before={PortfolioIcon} text="Portfolio" />
        </div>
      )}
    </Section>
  </Fragment>
);

// JSON representation
const jsonView = [
  {
    type: 'Section',
    id: 'header',
    items: [
      {
        type: () => (
          <div css={{ padding: '16px 0' }}>
            <JiraWordmark />
          </div>
        ),
        id: 'jira-wordmark',
      },
    ],
  },
  {
    type: 'Section',
    id: 'header',
    items: [
      {
        type: 'Item',
        id: 'dashboards',
        before: DashboardIcon,
        text: 'Dashboards',
      },
      { type: 'Item', id: 'projects', before: FolderIcon, text: 'Projects' },
      {
        type: 'Item',
        id: 'issues-and-filters',
        before: IssueIcon,
        text: 'Issues and filters',
      },
      {
        type: 'Item',
        id: 'portfolio',
        before: PortfolioIcon,
        text: 'Portfolio',
      },
    ],
  },
];`}

In this model a view is represented as an array of items. Each item in this array has a \`type\` property, an \`id\` property, and maybe an \`items\` property (if this item contains other items).

A few things to note:

* Some \`type\`s are built into the package (such as, 'Item' and 'Section') and these types can be provided as a string. In the above example the Jira wordmark component isn't built into \`navigation-next\`, so we have to provide a component as the type.
* A view is expected to be an array of Sections. Sections should not be nested.
* You can find a complete list of the in-built item types here. **INSERT LINK HERE AT SOME POINT**

${<H>A smart LayoutManager</H>}

Let's have a quick refresher on the LayoutManager component. It takes the following props:

* **\`children\`** - This is your page content. The state of this component will probably be driven by a router.
* **\`globalNavigation\`** - This component should remain consistent no matter what state your application is in.
* **\`productNavigation\`** - This component will change in response to user interaction and route changes.
* **\`containerNavigation\`** - This component will change in response to user interaction and route changes, and may never be rendered at all depending on the route.

So there's some complexity in managing the state of the product and container navigation layers. A naive approach might be to connect these to the router as well. But what about 'nested navigation' states that don't trigger a page transition, where the active view gets out of sync with the route? What if we want to hold on to the previous view while asynchronously loading in a new one?

We provide a state manager to help you handle this, and a wrapped version of the \`LayoutManager\` which connects to this state container and takes care of rendering the product and container navigation.

${(
    <IframeExample
      source={require('!!raw-loader!../examples/9999-views-controller-layoutmanagerwithviewcontroller')}
      title="LayoutManagerWithViewController"
      url="/examples.html?groupId=core&packageId=navigation-next&exampleId=views-controller-layoutmanagerwithviewcontroller"
    />
  )}

We haven't set any state yet, so the component will simply render a skeleton. Let's give it a view to display!

${<H>Managing the navigation state</H>}

The View state controller contains the active view, and methods for adding and activating views. Since we often want to read this state or perform these actions in lifecycle methods it's easiest to use a higher-order component to access the state container.

${code`
import { withNavigationViewController } from '@atlaskit/navigation-next';

class MyComponent extends React.Component {
  componentDidMount() {
    this.props.navigationViewController.addView(view);
  }

  render() {
    /* ... */
  }
}

export default withNavigationViewController(MyComponent);`}

Let's update our app to add and set a navigation view.

${(
    <IframeExample
      source={require('!!raw-loader!../examples/9999-views-controller-add-and-set-view')}
      title="LayoutManagerWithViewController"
      url="/examples.html?groupId=core&packageId=navigation-next&exampleId=views-controller-add-and-set-view"
    />
  )}

As you can see, a 'view' is an object with the following properties:

* **\`id\`** - A unique ID for this view.
* **\`type\`** - Either 'product' or 'container', this denotes which navigation layer this view should be rendered on.
* **\`getItems\`** - A function which should return an array representing the view.

${<H>Transitioning between views</H>}

Let's add a Project issues view to our navigation. Now when we click on the 'Issues and filters' item the view will update. Clicking the 'Back' item will take us back again.


${(
    <IframeExample
      source={require('!!raw-loader!../examples/9999-views-controller-update-view')}
      title="LayoutManagerWithViewController"
      url="/examples.html?groupId=core&packageId=navigation-next&exampleId=views-controller-update-view"
    />
  )}

So how is this working? There are a few things going on.

#### 1. Adding a \`goTo\` property to Items

Our 'Issues and filters' item now looks like this:

${code`{
  before: IssueIcon,
+ goTo: 'product/issues',
  id: 'issues-and-filters',
  text: 'Issues and filters',
  type: 'Item',
},`}

This renders a special Item which will call \`navigationViewController.setView('product/issues')\` when it's clicked. The 'Back' item in the 'product/issues' view works the same way.

#### 2. Linking nested Sections

To get a nested navigation animation we need to add some information to our Sections. Our menu sections now looks like this:

${code`// 'product/home' menu section
{
  items: [/* ... */],
  type: 'Section',
  id: 'product/home:menu',
+ parentId: null,
+ nestedGroupKey: 'menu',
}

// 'product/issues' menu section
{
  items: [/* ... */],
  type: 'Section',
  id: 'product/issues:menu',
  parentId: 'product/home:menu',
  nestedGroupKey: 'menu',
}`}

We've assigned each section a unique \`id\` prop. Because the 'product/issues' menu is conceptually a 'child' of the 'product/home' section, we set its \`parentId\` to 'product/home'. Finally, we need to give both sections a shared \`nestedGroupKey\`, which tells the renderer that it should perform a transition animation when one of these sections is replaced by another.
`}</ContentsProvider>
);
