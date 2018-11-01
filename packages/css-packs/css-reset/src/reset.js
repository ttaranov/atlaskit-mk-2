//@flow
import evaluateInerStyles from 'evaluate-inner-styles';
// Reset
export default evaluateInerStyles()`
  html,
  body,
  p,
  div,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ul,
  ol,
  dl,
  img,
  pre,
  form,
  fieldset {
    margin: 0;
    padding: 0;
  }
  img,
  fieldset {
    border: 0;
  }
`;
