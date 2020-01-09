import React from 'react';
import PropTypes from 'prop-types';

import Immutable from '../util/immutable';

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

    class WrapClass extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          state: null,
        };
      }

      componentDidMount() {
        this.unsubscribe = this.context.store.subscribe(() => {
          const state = this.context.store.getState();
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

      /**
       * getInstance
       * @return {ReactElement}
       */
      getInstance() {
        return this.ins;
      }

      render() {
        const {store} = this.context;

        const state = store.getState();

        let dispatch = {};
        if (mapDispatchToProps) {
          dispatch = mapDispatchToProps(store.dispatch.bind(store));
        }

        let props = {};
        if (mapStateToProps) {
          props = mapStateToProps(Immutable.cloneDeep(state));
        }

        return (
          <Component
            ref={ins => this.ins = ins}
            {...props}
            {...this.props}
            {...dispatch}
          />
        );
      }
    }

    WrapClass.contextTypes = {
      store: PropTypes.object,
    };

    return WrapClass;
  };
};
