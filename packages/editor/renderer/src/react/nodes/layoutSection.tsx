import * as React from 'react';

export default function LayoutSection(
  props: { layoutType: string } & React.Props<any>,
) {
  return <div data-layout-type={props.layoutType}>{props.children}</div>;
}
