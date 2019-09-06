import React from 'react';
import Immutable from '../util/immutable';
import { ProviderContext } from './Context';

/**
 * createConnect
 * @param {Function} - mapStateToProps
 * @param {Function} - mapDispatchToProps
 * @return {HOC}
 */
export default (mapStateToProps, mapDispatchToProps) => {
  /**
   * ConnectHOC
   * @param {ReactElement} - Component
   * @param {Func} - Callback
   */
  return (Component, Callback) => {
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          state: null,
        };
      }

      componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => {
          const state = this.store.getState();
          this.setState({
            state,
          }, () => {
            if (Callback) {
              Callback();
            }
          });
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        return (
          <ProviderContext.Consumer>{({ store }) => {
            if (!this.store) this.store = store;
            const state = this.state.state ? this.state.state : this.store.getState();

            let dispatch = {};
            if (mapDispatchToProps) {
              dispatch = mapDispatchToProps(this.store.dispatch.bind(this.store));
            }

            let props = {};
            if (mapStateToProps) {
              props = mapStateToProps(Immutable.cloneDeep(state));
            }

            return (<Component {...props} {...this.props} {...dispatch} />);
          }}
          </ProviderContext.Consumer>
        );
      }
    };
  };
};
