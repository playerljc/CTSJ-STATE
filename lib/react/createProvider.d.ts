import React from 'react';
/**
 * Provider
 * @class Provider
 * @classdesc Provider
 */
declare class Provider extends React.Component {
    static propTypes: {
        store: any;
    };
    props: {
        children: any;
    };
    render(): JSX.Element;
}
export default Provider;
