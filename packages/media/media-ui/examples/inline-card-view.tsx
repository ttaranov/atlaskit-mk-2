import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Button from '@atlaskit/button';
import {
  LinkView,
  ResolvedView,
  ResolvingView,
  ErroredView,
  ForbiddenView,
  UnauthorizedView,
} from '../src/InlineCard';

interface Lozenge {
  text: string;
  appearance: 'inprogress';
}

const url = 'https://product-fabric.atlassian.net/browse/MSW-524';
const icon =
  'https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg';
const title = 'MSW-524: [RFC] Api for inline Link cards UI component';
const lozenge: Lozenge = {
  text: 'in progress',
  appearance: 'inprogress',
};
const onClick = () => window.open(url);

class Example extends React.Component {
  state = {
    isSelected: false,
  };

  handleSelectedClick = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    });
  };

  render() {
    return (
      <Page>
        <Grid>
          <GridColumn>
            <Button label="Is selected?" onClick={this.handleSelectedClick}>
              {this.state.isSelected ? 'Deselect' : 'Make those selected'}
            </Button>
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            <h4>Paste link into editor</h4>
            Labore sunt adipisicing esse magna.
            <LinkView text={url} onClick={onClick} />
            <h4>Unauthorised view</h4>
            Labore sunt adipisicing esse magna.
            <UnauthorizedView
              isSelected={this.state.isSelected}
              icon={icon}
              onClick={() => {}}
              onAuthorise={() => {
                alert('Does nothing...');
              }}
              url={url}
            />
            <h4>ResolvingView</h4>
            Labore sunt adipisicing esse magna.
            <ResolvingView
              isSelected={this.state.isSelected}
              url={url}
              onClick={onClick}
            />
            Labore sunt adipisicing esse magna.
            <h4>No Permissions View</h4>
            Labore sunt adipisicing esse magna.
            <ForbiddenView
              isSelected={this.state.isSelected}
              url={url}
              onClick={() => {
                alert("Clicking me won't fix the permissions...");
              }}
              onAuthorise={() => {
                alert('Okay, what else have we got...');
              }}
            />
            <h4>Errored View</h4>
            Labore sunt adipisicing esse magna.
            <ErroredView
              isSelected={this.state.isSelected}
              message="Ooops, something went wrong!"
              url={url}
              onClick={() => {}}
              onRetry={() => {
                alert('Trying really hard!');
              }}
            />
            Labore sunt adipisicing esse magna.
            <h4>Resolved view</h4>
            Labore sunt adipisicing esse magna.
            <ResolvedView
              isSelected={this.state.isSelected}
              icon={icon}
              title={title}
              lozenge={lozenge}
              onClick={onClick}
            />
          </GridColumn>
        </Grid>
      </Page>
    );
  }
}

export default () => <Example />;
