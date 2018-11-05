import * as React from 'react';
import { PureComponent } from 'react';
import { AkCodeBlock } from '@atlaskit/code';
import overflowShadow, { OverflowShadowProps } from '../../ui/overflow-shadow';

const identity = (text: string): string => {
  return text;
};

export interface Props {
  language: string;
}

class CodeBlock extends PureComponent<Props & OverflowShadowProps, {}> {
  render() {
    const { children, language, handleRef, shadowClassNames } = this.props;

    const codeProps = {
      language,
      text: React.Children.map(children, identity).join(''),
    };

    return (
      <div className={`CodeBlock ${shadowClassNames}`} ref={handleRef}>
        <AkCodeBlock {...codeProps} />
      </div>
    );
  }
}

export default overflowShadow(CodeBlock, {
  overflowSelector: 'span',
  scrollableSelector: 'code',
});
