import * as React from 'react';
import { AudioCircle } from 'react-audio-vis';

export type Props = {};

export type State = {};
export class AudioVisualization extends React.Component<Props, State> {
  render() {
    return <AudioCircle />;
  }
}
