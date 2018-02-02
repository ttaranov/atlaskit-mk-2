export const customInsertMenuItems = [
  {
    content: 'Loren ipsun',
    value: { name: 'loren-ipsun' },
    tooltipDescription: 'Insert loren ipsun text',
    tooltipPosition: 'right',
    elemBefore: '-',
    onClick: function(editorActions) {
      editorActions.appendText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
      );
    },
  },
  {
    content: 'Info macro',
    value: { name: 'info' },
    tooltipDescription: 'Insert info macro',
    tooltipPosition: 'right',
    elemBefore: '-',
    onClick: function(editorActions) {
      editorActions.insertExtension({
        type: 'inlineExtension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'info',
          parameters: {
            macroParams: {},
            macroMetadata: {
              macroId: { value: new Date().valueOf() },
              placeholder: [
                {
                  data: { url: '' },
                  type: 'icon',
                },
              ],
            },
          },
        },
      });
    },
  },
  {
    content: 'Open macro browser',
    value: { name: 'macro-browser' },
    tooltipDescription: 'Open macro browser',
    tooltipPosition: 'right',
    elemBefore: '-',
    onClick: function(editorActions) {
      // tslint:disable-next-line:no-console
      console.log(
        'Fake promise that simulates the macro browser opening. Will resolve in 1 sec with a selected macro to be inserted.',
      );

      const openMacroBrowser = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            type: 'inlineExtension',
            attrs: {
              extensionType: 'com.atlassian.confluence.macro.core',
              extensionKey: 'cheese',
              parameters: {
                macroParams: {},
                macroMetadata: {
                  macroId: { value: new Date().valueOf() },
                  placeholder: [
                    {
                      data: { url: '' },
                      type: 'icon',
                    },
                  ],
                },
              },
            },
          });
        }, 1000);
      });

      openMacroBrowser.then(macro => editorActions.insertExtension(macro));
    },
  },
];
