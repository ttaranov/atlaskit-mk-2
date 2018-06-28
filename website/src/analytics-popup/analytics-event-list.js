// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';
import {
  borderRadius,
  gridSize,
  math,
  colors,
  elevation,
} from '@atlaskit/theme';

const Pre = styled.pre`
  display: block;
  font-size: 12px;
  font-family: SFMono-Medium, SF Mono, Segoe UI Mono, Roboto Mono, Ubuntu Mono,
    Menlo, Courier, monospace;
  width: auto;
  white-space: pre-wrap;
  font-weight: 500;
`;

const EventContainer = styled.div`
  padding: ${math.multiply(gridSize, 0.5)}px 0;
  cursor: pointer;
`;

const AnalyticsEvent = ({ event }: { event: Object }) => (
  <EventContainer
    onClick={() => console.log(event)}
    title="print full event to console"
  >
    <Pre>
      <span>{`'${event.actionSubject}' was '${event.action}'`}</span>
    </Pre>
  </EventContainer>
);

const Container = styled.div`
  background-color: ${colors.N30}
  border-radius: ${borderRadius}px;
  max-height: ${math.multiply(gridSize, 5 * 5)}px;
  min-height: ${math.multiply(gridSize, 4)}px;
  padding: ${math.multiply(gridSize, 0.5)}px ${math.multiply(gridSize, 2)}px;
  overflow: scroll;
`;

type Props = {
  events: Array<{ id: string, event: Object }>,
};

const AnalyticsEventList = ({ events }: Props) => {
  return (
    <Container>
      {events.map(({ id, event }) => <AnalyticsEvent event={event} key={id} />)}
    </Container>
  );
};

export default AnalyticsEventList;
