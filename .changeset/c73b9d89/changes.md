* actions prop officially accepts Node type for text. Adds optional key to action type.

Previously if you were using the actions prop like:

```jsx
<Spotlight
  actions={[
    {
      text: <FormattedMessage defaultMessage="Next" />,
    },
    {
      text: <FormattedMessage defaultMessage="Skip" />,
    },
  ]}
>
  Look at this feature
</Spotlight>
```

React would complain about duplicate keys. Now you can pass in
a key for the action like:

```jsx
<Spotlight
  actions={[
    {
      text: <FormattedMessage defaultMessage="Next" />,
      key: 'next',
    },
    {
      text: <FormattedMessage defaultMessage="Skip" />,
      key: 'skip',
    },
  ]}
>
  Look at this feature
</Spotlight>
```
