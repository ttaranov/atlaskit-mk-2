import * as React from 'react';
import Button from '@atlaskit/button';
import Checkbox from '@atlaskit/checkbox';
import { FilmstripView } from '../src/filmstripView';
import { FilmstripContainer, Code } from '../example-helpers/styled';
import { MutableCard } from '../example-helpers/index';
import * as debounce from 'debounce';

export interface ExampleProps {}

export interface ExampleState {
  animate: boolean;
  offset: number;
  isAnimating: boolean;
}

export class Example extends React.Component<ExampleProps, ExampleState> {
  divElement: HTMLElement;
  // store the profile values out of state, to keep the render cycle cleaner when updating values
  handleMutationCalls: number = 0;
  handleSizeChangeCalls: number = 0;
  renderCalls: number = 0;

  state: ExampleState = {
    animate: false,
    offset: 0,
    isAnimating: false,
  };

  onSaveDivRef = (el: HTMLElement) => {
    this.divElement = el;
  };

  handleSizeChange = ({ offset }) => this.setState({ offset });
  handleScrollChange = ({ offset, animate }) =>
    this.setState({ offset, animate });

  growMutableCard = () => {
    this.divElement.style.width = `${window.innerWidth - 50}px`;
  };

  shrinkMutableCard = () => {
    this.divElement.style.width = '250px';
  };

  handleCheckboxChange = ({ e, isChecked }) => {
    this.setState({ isAnimating: isChecked });
  };

  saveFilmstripViewRef = (instance: FilmstripView) => {
    if (!instance) {
      return;
    }

    const { handleMutation, handleSizeChange, render } = instance;

    // profile handleMutation
    instance.mutationObserver.disconnect();
    // since this is already setup in constructor, we need to re-attach for this examples profiling
    instance.mutationObserver = new MutationObserver(
      debounce(
        mutationList => {
          this.handleMutationCalls++;
          this.updateProfileCount('handleMutationCalls');
          handleMutation(mutationList);
        },
        30,
        true,
      ),
    );
    instance.initMutationObserver();

    // profile handleSizeChange
    instance.handleSizeChange = () => {
      this.handleSizeChangeCalls++;
      this.updateProfileCount('handleSizeChangeCalls');
      handleSizeChange();
    };

    // profile render
    instance.render = () => {
      // we use an instance var instead of state to avoid infinite render loop
      this.renderCalls++;
      this.updateProfileCount('renderCalls');
      return render.call(instance);
    };
  };

  updateProfileCount(id: string) {
    const container = document.getElementById(id);
    if (container) {
      container.textContent = `${this[id]}`;
    }
  }

  render() {
    const { animate, offset, isAnimating } = this.state;

    return (
      <div>
        <h1>Catch DOM Mutations</h1>
        <p>
          This story renders children which update the DOM outside of the
          filmstrip React life-cycle.<br />
          There once was a bug in filmstrip that resulted in the Filmstrip not
          being navigable under certain edge cases<br />
          where children would update async outside of normal React life-cycle,
          such as an image loading its src attribute.<br />
          See{' '}
          <a href="https://product-fabric.atlassian.net/browse/MSW-425">
            MSW-425
          </a>.
        </p>
        <h2>Profiling</h2>
        <p>
          This example also profiles the following methods to track performance:
        </p>
        {this.renderProfilingInfo()}
        <FilmstripContainer>
          <FilmstripView
            ref={this.saveFilmstripViewRef}
            animate={animate}
            offset={offset}
            onSize={this.handleSizeChange}
            onScroll={this.handleScrollChange}
          >
            <MutableCard
              index={1}
              title="first"
              onSaveDivRef={this.onSaveDivRef}
              isAnimating={isAnimating}
            />
            <MutableCard index={2} title="second" isAnimating={isAnimating} />
            <MutableCard index={3} title="third" isAnimating={isAnimating} />
          </FilmstripView>
        </FilmstripContainer>
        <Checkbox
          label="Animate Children"
          initiallyChecked={false}
          onChange={this.handleCheckboxChange}
        />
        <p>
          <Button onClick={this.growMutableCard}>Grow +</Button>
          &nbsp;
          <Button onClick={this.shrinkMutableCard}>Shrink -</Button>
        </p>
        <p>
          The <b>first</b> element will respond to clicking the <b>Grow</b> and{' '}
          <b>Shrink</b> buttons. This will demonstrate a DOM change which
          happens outside of Reacts life-cycle methods. The{' '}
          <b>Animate Children</b> toggle will trigger changes in the children
          which will are also outside of the React life-cycle. The elements show
          the number of renders in brackets within their heading. The element
          checkboxes render without causing the element to render.
        </p>
      </div>
    );
  }

  renderProfilingInfo() {
    return (
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Call Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Code>FilmstripView.handleMutation()</Code>
            </td>
            <td id="handleMutationCalls" />
          </tr>
          <tr>
            <td>
              <Code>FilmstripView.handleSizeChange()</Code>
            </td>
            <td id="handleSizeChangeCalls" />
          </tr>
          <tr>
            <td>
              <Code>FilmstripView.render()</Code>
            </td>
            <td id="renderCalls" />
          </tr>
        </tbody>
      </table>
    );
  }
}

export default () => <Example />;
