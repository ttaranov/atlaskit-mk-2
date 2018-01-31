import * as React from 'react';
import { Component } from 'react';
import { Wrapper } from './styled';

export interface AnnotationsProps {

}

export interface AnnotationsState {

}

export class Annotations extends Component<AnnotationsProps, AnnotationsState> {
    render() {
        return (
            <Wrapper>
                Annotation component that can replace or overlap any view
            </Wrapper>
        );
    }
}