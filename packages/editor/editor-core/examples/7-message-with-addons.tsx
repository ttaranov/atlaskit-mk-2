import * as React from 'react';

import Editor from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithHelpTrigger from './../src/ui/WithHelpTrigger';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { Addon, AddonConfiguration } from '../src/ui/Addon';
import DocumentIcon from '@atlaskit/icon/glyph/document';
import QuestionIcon from '@atlaskit/icon/glyph/editor/help';
import { AtlassianIcon } from '@atlaskit/logo';
import styled from 'styled-components';

// tslint:disable-next-line:no-console
const SAVE_ACTION = () => console.log('Save');

// tslint:disable-next-line:no-console
const analyticsHandler = (actionName, props) => console.log(actionName, props);

// tslint:disable-next-line:variable-name
const AddonComponentExample = styled.div`
  background: #f08;
  border-radius: 5px;
  padding: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  color: white;

  > button {
    padding: 6px 10px;
    margin: 8px auto 0;
    width: 50%;
  }
`;

class OpenHelp extends React.Component<any, any> {
  render() {
    this.props.openHelp();
    return null;
  }
}

const openHelp = openHelp => <OpenHelp openHelp={openHelp} />;

/**
 * List of addon configuration objects
 */
const addonConfigs: AddonConfiguration[] = [
  {
    text: 'Render on click',
    icon: <DocumentIcon label="Item 1" />,
    renderOnClick: (editorActions, closePopup) => (
      <AddonComponentExample>
        Rendered on click
        <button onClick={closePopup}>close</button>
      </AddonComponentExample>
    ),
  },
  {
    text: 'Clear editor',
    icon: <AtlassianIcon label="Item 2" />,
    actionOnClick: editorActions => editorActions.clear(),
  },
  {
    text: 'Formatting Tips',
    icon: <QuestionIcon label="Formatting tips" />,
    renderOnClick: () => <WithHelpTrigger render={openHelp} />,
  },
];

const addons = addonConfigs.map(
  ({ text, icon, actionOnClick, renderOnClick }, i) => (
    <Addon
      key={i}
      icon={icon}
      actionOnClick={actionOnClick}
      renderOnClick={renderOnClick}
    >
      {text as any}
    </Addon>
  ),
);

export default function Example() {
  return (
    <EditorContext>
      <ToolsDrawer
        // tslint:disable-next-line:jsx-no-lambda
        renderEditor={({
          disabled,
          mentionProvider,
          emojiProvider,
          taskDecisionProvider,
          contextIdentifierProvider,
          mediaProvider,
          onChange,
        }) => (
          <Editor
            appearance="message"
            analyticsHandler={analyticsHandler}
            allowCodeBlocks={true}
            allowHelpDialog={true}
            disabled={disabled}
            saveOnEnter={true}
            mentionProvider={mentionProvider}
            emojiProvider={emojiProvider}
            taskDecisionProvider={taskDecisionProvider}
            contextIdentifierProvider={contextIdentifierProvider}
            mediaProvider={mediaProvider}
            onChange={onChange}
            onSave={SAVE_ACTION}
            addonToolbarComponents={addons}
            quickInsert={true}
          />
        )}
      />
    </EditorContext>
  );
}
