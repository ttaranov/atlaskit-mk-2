import * as React from 'react';
export default function OrderedList(
  props: { start?: number } & React.Props<any>,
) {
  return <ol start={props.start}>{props.children}</ol>;
}
