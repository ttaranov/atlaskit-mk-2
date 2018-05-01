// @flow

/**
 * Heuristically check whether an element is a react element or not.
 * React elements have constructors for their type property but native elements use strings.
 */
// flowlint-next-line unclear-type:off
export default (element: any) => {
  const type = element && element.type;
  const hasFunctionAsType = !!type && typeof type === 'function';
  const hasProps = element && element.props;
  return hasFunctionAsType && hasProps;
};
