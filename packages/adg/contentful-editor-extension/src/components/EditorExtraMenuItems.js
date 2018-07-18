import React from 'react';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import examples from '../../examples';

export const customInsertMenuItems = examples.map(({ key, component }) => ({
  content: key,
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
          tag: key,
          props: {
            name: 'xlarge',
            size: 'xlarge',
            presence: 'online',
          },
          test: 'hello',
        },
      },
    });
  },
}));

export const customInsertMenuItemsOld = [
  {
    content: 'Basic avatar',
    value: { name: 'inline-eh' },
    tooltipDescription: 'Inline macro (Using extension handlers)',
    tooltipPosition: 'right',
    elemBefore: <AtlassianIcon />,
    onClick: editorActions => {
      //   console.log(editorActions)
      //   //console.log(await editorActions.getValue())
      //   // editorActions.replaceDocument(
      //   //   {
      //   //     type: "paragraph",
      //   //     content: [
      //   //       {
      //   //         type: "text",
      //   //         text: "Some text in a paragraph"
      //   //       }
      //   //     ]
      //   //   }
      //   // );
      //   editorActions.replaceSelection({
      //     type: '',
      //     content: [{
      //       type: 'text',
      //       text: 'var x = 10'
      //     }]
      //   })
      // }
      // <Avatar name="xlarge" size="xlarge" presence="online" />
      editorActions.replaceSelection({
        type: 'inlineExtension',
        attrs: {
          extensionType: 'com.ajay.test',
          extensionKey: 'block-eh',
          parameters: {
            tag: Avatar,
            props: {
              name: 'xlarge',
              size: 'xlarge',
              presence: 'online',
            },
            test: 'hello',
          },
        },
      });
    },
  },
];
