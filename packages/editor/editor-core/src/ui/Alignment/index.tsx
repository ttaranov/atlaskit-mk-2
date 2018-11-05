import * as React from 'react';
import { PureComponent } from 'react';
import AlignmentButton from './AlignmentButton';

import { AlignmentWrapper } from './styles';
import { iconMap } from '../../plugins/alignment/ui/ToolbarAlignment';

export interface Props {
  selectedAlignment?: string;
  onClick: (value: string) => void;
  className?: string;
}

const alignmentOptions: string[] = ['left', 'center', 'right'];

export default class Alignment extends PureComponent<Props, any> {
  render() {
    const { onClick, selectedAlignment, className } = this.props;

    return (
      <AlignmentWrapper className={className} style={{ maxWidth: 3 * 32 }}>
        {alignmentOptions.map(alignment => {
          return (
            <AlignmentButton
              content={iconMap[alignment]}
              key={alignment}
              value={alignment}
              label={alignment}
              onClick={onClick}
              isSelected={alignment === selectedAlignment}
            />
          );
        })}
      </AlignmentWrapper>
    );
  }
}
