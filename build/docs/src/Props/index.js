import React from 'react';
import PrettyProps from 'prettyproptypes';
import Button from '@atlaskit/button';
import components from './components';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';

components.Button = ({ isCollapsed, ...rest }) => {
  return (
    <Button
      iconBefore={
        isCollapsed ? (
          <ChevronDownIcon label="expandIcon" />
        ) : (
          <ChevronUpIcon label="collapseIcon" />
        )
      }
      {...rest}
    />
  );
};

const Props = props => <PrettyProps components={components} {...props} />;

export default Props;
