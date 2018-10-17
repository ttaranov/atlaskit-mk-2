import * as React from 'react';
export default function Paragraph(props: React.Props<any>) {
  const { children } = props;
  const childCount = React.Children.toArray(children).length;
  return <p>{childCount ? children : <br />}</p>;
}
