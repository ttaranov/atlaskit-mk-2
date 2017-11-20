import * as React from 'react';

export interface ImageProps extends React.Props<any> { alt?: string, title?: string, src?: string };

export default function Image(props: ImageProps) {
  return <img src={props.src} alt={props.alt} title={props.title} />
}
