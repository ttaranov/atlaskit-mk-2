
// @flow

import React from 'react';
import type { Node } from 'react';

export default class TableCell extends React.Component {
    static defaultProps = {
        isDragging: false
    }

    componentWillReceiveProps(nextProps) {
        const wasDragging = !!this.props.isDragging;
        const willDragging = !!nextProps.isDragging;

        if (wasDragging !== willDragging) {
            this.setState({
                width: this.ref.offsetWidth
            });
        }
    }

    getCellStyles = () => {
        const baseStyle = {
            boxSizing: 'border-box',
        };

        if (!this.props.isDragging) {
            return baseStyle;
        }

        return {
            width: this.state.width,
            ...baseStyle
        }
    }

    render() {
        const { isDraggable, children } = this.props;
           

        return <td ref={ref => {this.ref = ref}} style={this.getCellStyles()}>
                 {children}
             </td>
    }
}