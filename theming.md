# Visual Customistation

## What is the point of visual customisation?

If our components support flexible appearances, they are re-useable in many more
situations.

## What are **not** visual customisations

* Component behaviour
* i18n
* a11y

The above component features should be always consistent, regardless of how they look.

## What are the types of visual customisation are there?

1. Theming customisations

These customisations changes the appearance of all components. Components
lean as much as possible on information passed through the theme.

Examples: light mode, dark mode

```js
const themes = {
  akLight: {
    primary: '#f23x'
    secondary: '#df4'
  }
  akDark: {
    primary: '#3dd'
    secondary: '#d9c'
  }
  trelloLight: {
    primary: '#7xs'
    secondary: '#33r'
  }
}

export default ({ mode, children }) => (
  <ThemeProvider theme={themes[mode]}>
    {children}
  </ThemeProvider>
)
```

2. Component customisations

These are props that effect the appearance of a component.

Examples: the appearance prop in Button

```js
const WarningButton = () => <Button appearance="warning">Warning</Button>;
```

3. Component styling customisations

These are styles that are passed through props and applied to the internals
of a component.

```js
const BespokeButton = () => (
  <Button styles={{ background: '#333' }}>Dark Button</Button>
);
```
