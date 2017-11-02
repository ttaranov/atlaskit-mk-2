# Flow typing a component

Related reading:

- https://flow.org/en/docs/react/
- https://building.coursera.org/blog/2017/06/01/best-practices-for-flow-typing-react-components/

## Important call-outs

We can refer to the related reading for most of the information, however there's some important things to call out that we've been asked or

- Passing generics in https://flow.org/en/docs/react/components/
- Dealing with refs https://flow.org/en/docs/react/refs/

*We used to have to type `props: Props` on the class body so that we could generate `PropTypes` for React <= 16. However, we're not doing that anymore, so we only need to pass them as generics.*
