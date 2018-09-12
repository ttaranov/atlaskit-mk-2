import { md } from '@atlaskit/docs';

export default md`
  # MediaFilmstrip

  Provides a component that shows multiple media cards horizontally. Allows to navigate through the stored cards.

  ## FilmstripView

  ### Usage

  ~~~javascript
  import React from 'react';
  import { FilmstripView } from '@atlaskit/media-filmstrip';

  class FilmstripViewExample extends React.Component {
    state = {
      animate: false,
      offset: 0,
    };

    handleSizeChange = ({ offset }) => this.setState({ offset });

    handleScrollChange = ({ animate, offset }) =>
      this.setState({ animate, offset });

    render() {
      const { animate, offset, children } = this.state;
      return (
        <FilmstripView
          animate={animate}
          offset={offset}
          onSize={this.handleSizeChange}
          onScroll={this.handleScrollChange}
        >
          <div>#1</div>
          <div>#2</div>
          <div>#3</div>
          <div>#4</div>
          <div>#5</div>
        </FilmstripView>
      );
    }
  }
  ~~~

  ### Properties

  #### animate

  A \`boolean\`. Defaults to \`false\`.

  When \`true\`, any change to the \`offset\` property will be animated.

  > Having \`animate=true\` results in an awkward UX when changing the \`offset\` property before the
  > animation finishes.

  #### offset

  A \`number\`. Defaults to \`0\`.

  Determines the visible portion of the filmstrip.

  #### onSize

  A \`function\` called when the size of the filmstrip has been changed e.g. when mounted, after the
  window is resized or the children have changed.

  **Arguments:**

  * \`event\`
    * \`width\` - A \`number\`. The visible width of the filmstrip;
    * \`offset\` - A \`number\`.
    * \`offsets\`: ChildOffset[];
    * \`minOffset\` - A \`number\`.
    * \`maxOffset\` - A \`number\`.

  #### onScroll

  A \`function\` called when the user has indicated they wish to change the visible porition of the filmstrip e.g. clicked
  the left or right arrows, or scrolled the scroll wheel.

  **Arguments:**

  * \`event\`
    * \`direction\` - Either \`"left"\` or \`"right"\`. The direction the user wants to move the filmstrip.
    * \`offset\` - A \`number\`. The desired offset.
    * \`animate\` - A \`boolean\`. Whether the change should be animated (this arg could probably do with a better name!)

  #### children

  Any React \`node\`.
`;
