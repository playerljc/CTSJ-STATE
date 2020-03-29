import React from 'react';

export interface HelloProps {
  compiler: string;
  framework: string;
}

// export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;

class Hello extends React.PureComponent<HelloProps> {
  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>;
  }
}

export default Hello;
