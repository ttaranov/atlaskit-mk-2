# Controlled / uncontrolled props

Related reading:

* https://reactjs.org/docs/uncontrolled-components.html
* https://github.com/treshugart/react-ctrl

## History

We used to separate our components into stateful and stateless versions. This allowed us to offer safe defaults while giving the consumer of our API full control. Unfortunately, this draws a hard line between the two patterns and offers no flexibility in between the two.

It was sort of the hot thing at the time when we made the decision to follow this pattern. It was a fairly simple separation that we could easily follow and apply to all components. This made our lives easier, but over time, we discovered that it made our consumers' lives harder and we'd selectively add this pattern to individual props for whichever component we had the complaint for, which bred inconsistency.

## Learning

We've recently been spiking some patterns to be able to give consumers the ability to selectively apply the controlled / uncontrolled pattern to any given piece of state within a component. This means that not only form fields and the `defaultValue` / `value` props get this treatment, all `state` can have corresponding default props (uncontrolled) or props (controlled).

On the component developer's end, the steps are pretty simple:

1. Expose a default prop and normal prop that correspond to a state key that you want to have this behaviour. The default convention for this is that the controlled prop is the same name as the state, and the default prop is prefixed with `default`. For `value`, this would mean you have a `value` prop and a `defaultValue` prop. This is configurable by specifying your own `mapPropsToState` function when wrapping your component with [`react-ctrl`](https://github.com/treshugart/react-ctrl).
2. Wrap their component with [`react-ctrl`](https://github.com/treshugart/react-ctrl).

Since your component is already accessing `state` and using it as needed, it's likely you won't need to do much more than those two steps to enable this behaviour as `state` is the source of truth for everything now.

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

Internally, this enables us to reuse a lot more code. Externally, the consumer gets a more consistent and predictable API. It doesn't look like much initially, but because of this, you can now control - or specify defaults for - other props such as `isOpen`.

```js
<DatePicker isOpen />
```

Or just have it open by default, and state will take over:

```js
<DatePicker defaultIsOpen />
```

The component developer doesn't need to do any more work here; this automatically just happens.
