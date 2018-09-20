import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { Card } from '@atlaskit/smart-card';

import { stateKey as ReactNodeviewStateKey } from '../../base/pm-plugins/react-nodeview';
import WithPluginState from '../../../ui/WithPluginState';
import { EventDispatcher } from '../../../event-dispatcher';

export interface Props {
  children?: React.ReactNode;
  node: PMNode;
  getPos: () => number;
  eventDispatcher?: EventDispatcher;
}

export default class InlineCardNode extends React.PureComponent<Props, {}> {
  render() {
    const { node, getPos, eventDispatcher } = this.props;
    const { url, data } = node.attrs;

    const nodePos = getPos();

    return (
      <WithPluginState
        plugins={{
          selection: ReactNodeviewStateKey,
        }}
        eventDispatcher={eventDispatcher}
        render={({ selection }) => {
          const { anchorPos, headPos } = selection;
          return (
            <Card
              url={url}
              data={data}
              appearance="inline"
              isSelected={nodePos >= anchorPos && nodePos < headPos}
            />
          );
        }}
      />
    );
  }
}
