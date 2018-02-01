import {
  MediaSingle as UIMediaSingle,
  MediaSingleLayout,
} from '@atlaskit/editor-common';
import * as React from 'react';
import { ReactElement } from 'react';

export interface Props {
  children: ReactElement<any>;
  layout: MediaSingleLayout;
}

export default function MediaSingle(props: { layout: MediaSingleLayout } & React.Props<any>) {
  const child = React.Children.only(React.Children.toArray(props.children)[0]);

  const media = React.cloneElement(child, {
    cardDimensions: {
      width: '100%',
      height: '100%',
    },
  });

  const { height, width } = child.props;

  return (
    <UIMediaSingle layout={props.layout} width={width} height={height}>
      {media}
    </UIMediaSingle>
  );
}
