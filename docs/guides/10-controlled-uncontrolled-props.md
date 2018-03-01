# Controlled / uncontrolled props

Related reading:

* https://reactjs.org/docs/uncontrolled-components.html
* https://github.com/treshugart/react-ctrl

## History

We used to separate our components into stateful and stateless versions. This allowed us to offer safe defaults while giving the consumer of our API full control. Unfortunately, this draws a hard line between the two patterns and offers no in between state.

It was sort of the hot thing at the time when we made the decision to follow this pattern. It was a fairly simple separation that we could easily follow and apply to all components. This made our lives easier, but over time, we discovered that it made our consumers' lives harder and we'd selectively add this pattern to individual props for whichever component we had the complaint for.

This breeds inconsistency between components where we had originally introduced this pattern to help with consistency and flexibility. The downfall is that there is a hard line between the two patterns and most of the time, consumers need to do stuff in between that.

## Learning

We've recently been spiking some patterns to be able to give consumers the ability to selectively apply the controlled / uncontrolled pattern to any given piece of state within a component. This means that not only form fields and the `value` prop get this treatment, all props / state do. On the component developer's end, the steps are pretty simple:

1. Expose a prop that corresponds to a state key. Usually this is the same name, but can be mapped if they're different.
2. Access the `state` value. Prop / default prop values are automatically resolved and returned via `state`. This actually isn't really a step as the component is likely already doing this.
3. Wrap their component with [`react-ctrl`](https://github.com/treshugart/react-ctrl).

Most of the common cases are now automatically taken care of.

## Usage

Initially, we've applied this to the `calendar` and `datetime-picker` components but hope to expand support across all of our components starting in the near future.

In order to get both controlled and uncontrolled behaviour from the `datetime-picker`, we used to have to do:

```js
import { DatePicker, DatePickerStateless } from '@atlaskit/datetime-picker';

// Uncontrolled.
<DatePicker defaultValue="2000-01-01" />

// Controlled.
<DatePickerStateless value="2000-01-01" />
```

However, now, all we have to do is:

```js
import { DatePicker } from '@atlaskit/datetime-picker';

// Uncontrolled.
<DatePicker defaultValue="2000-01-01" />

// Controlled.
<DatePicker value="2000-01-01" />
```

Internally, this enables us to reuse a lot more code. Externally, the consumer gets a more consistent and predictable API. What's neat about this approach is that you can also control other props such as `isOpen`:

```js
<DatePicker isOpen />
```

Or just have it open by default, and state will take over:

```js
<DatePicker defaultIsOpen />
```

The component developer doesn't need to do any more work here; this automatically just happens.

## Moving forward

Moving forward, we should strive to wrap our stateful components with [`react-ctrl`](https://github.com/treshugart/react-ctrl) so that we can provide this behavour out of the box for all of our components to reduce both the burden of consumption as well as the burden of development.
