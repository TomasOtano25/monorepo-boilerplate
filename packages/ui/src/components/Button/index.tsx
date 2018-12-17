import * as React from "react";
import styled from "styled-components";

const Button = styled.button`
    color: red;
`;

export class C extends React.PureComponent{
    render() {
        return (<Button>hi</Button>);
    }
}