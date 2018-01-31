import * as React from 'react';
import { Component } from 'react';
import { Wrapper } from './styled';

export interface ErrorProps {

}

export interface ErrorState {

}

export class Error extends Component <ErrorProps, ErrorState> {
    render() {
        return (
            <Wrapper>
                <h2>This is an error view</h2>
            </Wrapper>
        );
    }
}