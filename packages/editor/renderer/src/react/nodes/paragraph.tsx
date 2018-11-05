import * as React from 'react';
export default function Paragraph(props) {
  const { children } = props;
  const childCount = React.Children.toArray(children).length;

  if (!childCount) {
    return <p>&nbsp;</p>;
  }

  return <p>{children}</p>;
}
