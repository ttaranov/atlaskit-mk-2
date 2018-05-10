import * as React from 'react';
import { MouseEvent } from 'react';
import styled from 'styled-components';
import {
  akColorN30,
  akColorN90,
  akColorN20,
} from '@atlaskit/util-shared-styles';
import { akEditorFullPageMaxWidth } from '@atlaskit/editor-common';
import { EditorAppearanceComponentProps, EditorAppearance } from '../../types';
import Avatars from '../../plugins/collab-edit/ui/avatars';
import PluginSlot from '../PluginSlot';
import Toolbar from '../Toolbar';
import ContentStyles from '../ContentStyles';
import { ClickAreaBlock } from '../Addon';
import WidthDetector from '../WidthDetector';
import {
  MeetingNotesTemplate,
  HealthMonitorTemplate,
  RetrospectiveTemplate,
  Daci,
} from '../../../src/templates/index';

const GUTTER_PADDING = 26;

const FullPageEditorWrapper = styled.div`
  min-width: 340px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;
FullPageEditorWrapper.displayName = 'FullPageEditorWrapper';

const ScrollContainer = styled(ContentStyles)`
  flex-grow: 1;
  overflow-y: scroll;
  position: relative;
  display: flex;
  flex-direction: column;
`;
ScrollContainer.displayName = 'ScrollContainer';

const ContentArea = styled.div`
  height: 100%;
  width: 100%;
  max-width: ${akEditorFullPageMaxWidth + GUTTER_PADDING * 2}px;
  padding-top: 50px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-bottom: 55px;

  & .ProseMirror {
    flex-grow: 1;
    box-sizing: border-box;
  }

  && .ProseMirror {
    & > * {
      clear: both;
    }
    > p,
    > ul,
    > ol,
    > h1,
    > h2,
    > h3,
    > h4,
    > h5,
    > h6 {
      clear: none;
    }
  }
  & .ProseMirror .table-container table {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
`;
ContentArea.displayName = 'ContentArea';

const MainToolbar = styled.div`
  position: relative;
  align-items: center;
  border-bottom: 1px solid ${akColorN30};
  display: flex;
  height: 80px;
  flex-shrink: 0;
`;
MainToolbar.displayName = 'MainToolbar';

const MainToolbarCustomComponentsSlot = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;
MainToolbarCustomComponentsSlot.displayName = 'MainToolbar';

const SecondaryToolbar = styled.div`
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  display: flex;
  padding: 24px 0;
`;
SecondaryToolbar.displayName = 'SecondaryToolbar';

const TemplateArea = styled.div`
  display: flex;
  align-items: start;
  position: absolute;
  bottom: 40px;
  background: white;
  z-index: 100;
  width: 100%;

  & .template-title {
    font-weight: bold;
    line-height: 30px;
  }

  & .template-data {
    color: ${akColorN90};
    font-size: 12px;
  }

  & .template-item {
    margin: 20px;
    padding: 15px;
    flex-grow: 1;
    cursor: pointer;
    border: 1px solid ${akColorN20};
    display: flex;
    flex-direction: column;
    align-items: center;

    &:hover {
      box-shadow: 3px 3px 3px #f3f2f2;
    }
  }
`;
const templateMap = {
  blog: MeetingNotesTemplate,
  health: HealthMonitorTemplate,
  retro: RetrospectiveTemplate,
  daci: Daci,
};

const TemplateItem = props => (
  <div className="template-item" onClick={props.onClick}>
    <div className="template-img">
      <img height="100px" src={`./src/assets/${props.icon}.svg`} />
    </div>
    <div className="template-info">
      <div className="template-title">{props.title}</div>
      <div className="template-data">{props.info}</div>
    </div>
  </div>
);

export default class Editor extends React.Component<
  EditorAppearanceComponentProps,
  any
> {
  static displayName = 'FullPageEditor';
  private appearance: EditorAppearance = 'full-page';

  constructor(props) {
    super(props);
    this.state = {
      data: props.editorView && props.editorView!.state!.doc.content.size > 2,
    };
  }

  stopPropagation = (event: MouseEvent<HTMLDivElement>) =>
    event.stopPropagation();

  addTemplate = template => {
    this.props.editorActions!.replaceDocument(templateMap[template]);
    this.setState({
      data: true,
    });
  };

  showTemplates = () => {
    this.setState({
      data: !this.state.data,
    });
  };

  render() {
    const {
      editorDOMElement,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      primaryToolbarComponents,
      contentComponents,
      customPrimaryToolbarComponents,
      customContentComponents,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      disabled,
      collabEdit,
    } = this.props;
    const { data } = this.state;

    return (
      <FullPageEditorWrapper>
        {!data && (
          <TemplateArea>
            <TemplateItem
              title="Blog post"
              icon="Celebration"
              type="blog"
              info="Share news and announcements with your team"
              onClick={this.addTemplate.bind(null, 'blog')}
            />
            <TemplateItem
              title="Meeting notes"
              icon="ClipboardList"
              type="health"
              info="Share news and announcements with your team"
              onClick={this.addTemplate.bind(null, 'health')}
            />
            <TemplateItem
              title="Decision"
              icon="Experiment"
              type="retro"
              info="Share news and announcements with your team"
              onClick={this.addTemplate.bind(null, 'retro')}
            />
            <TemplateItem
              title="Product Requirements"
              icon="Prediction"
              type="retro"
              info="Share news and announcements with your team"
              onClick={this.addTemplate.bind(null, 'retro')}
            />
          </TemplateArea>
        )}
        <MainToolbar>
          <Toolbar
            editorView={editorView!}
            editorActions={editorActions}
            eventDispatcher={eventDispatcher!}
            providerFactory={providerFactory}
            appearance={this.appearance}
            items={primaryToolbarComponents}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
            popupsScrollableElement={popupsScrollableElement}
            disabled={!!disabled}
            showTemplates={this.showTemplates}
          />
          <MainToolbarCustomComponentsSlot>
            <Avatars
              editorView={editorView}
              eventDispatcher={eventDispatcher}
              inviteToEditHandler={collabEdit && collabEdit.inviteToEditHandler}
              isInviteToEditButtonSelected={
                collabEdit && collabEdit.isInviteToEditButtonSelected
              }
            />
            {customPrimaryToolbarComponents}
          </MainToolbarCustomComponentsSlot>
        </MainToolbar>
        <ScrollContainer>
          <ClickAreaBlock editorView={editorView}>
            <ContentArea>
              <div
                style={{ padding: `0 ${GUTTER_PADDING}px` }}
                className="content-area"
              >
                {customContentComponents}
                {
                  <PluginSlot
                    editorView={editorView}
                    editorActions={editorActions}
                    eventDispatcher={eventDispatcher}
                    providerFactory={providerFactory}
                    appearance={this.appearance}
                    items={contentComponents}
                    popupsMountPoint={popupsMountPoint}
                    popupsBoundariesElement={popupsBoundariesElement}
                    popupsScrollableElement={popupsScrollableElement}
                    disabled={!!disabled}
                  />
                }
                {editorDOMElement}
              </div>
            </ContentArea>
          </ClickAreaBlock>
          {!data && (
            <TemplateArea>
              <TemplateItem
                title="DACI"
                icon="Celebration"
                type="blog"
                info="Share news and announcements with your team"
                onClick={this.addTemplate.bind(null, 'daci')}
              />
              <TemplateItem
                title="Meeting notes"
                icon="ClipboardList"
                type="health"
                info="Share news and announcements with your team"
                onClick={this.addTemplate.bind(null, 'health')}
              />
              <TemplateItem
                title="Decision"
                icon="Experiment"
                type="retro"
                info="Share news and announcements with your team"
                onClick={this.addTemplate.bind(null, 'retro')}
              />
              <TemplateItem
                title="Product Requirements"
                icon="Prediction"
                type="retro"
                info="Share news and announcements with your team"
                onClick={this.addTemplate.bind(null, 'retro')}
              />
            </TemplateArea>
          )}
        </ScrollContainer>
        <WidthDetector editorView={editorView!} />
      </FullPageEditorWrapper>
    );
  }
}
