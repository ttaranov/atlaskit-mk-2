import React from 'react';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import designGuideExamples from '../../DESIGN_EXAMPLES';

export const customInsertMenuItems = designGuideExamples.map(
  ({ name, component, componentPath }) => ({
    content: name,
    title: name,
    value: { name: 'inline-eh' },
    tooltipDescription: 'Inline macro (Using extension handlers)',
    tooltipPosition: 'right',
    elemBefore: <AtlassianIcon />,
    onClick: editorActions => {
      editorActions.replaceSelection({
        type: 'inlineExtension',
        attrs: {
          extensionType: 'com.ajay.test',
          extensionKey: 'block-eh',
          parameters: {
            componentPath,
          },
        },
      });
    },
    action(insert) {
      return insert({
        type: 'inlineExtension',
        attrs: {
          extensionType: 'com.ajay.test',
          extensionKey: 'block-eh',
          parameters: {
            componentPath,
          },
        },
      });
    },
  }),
);

export default function quickInsertProviderFactory() {
  return {
    getItems() {
      return new Promise(resolve => {
        setTimeout(() => resolve(customInsertMenuItems), 100);
      });
    },
  };
}
