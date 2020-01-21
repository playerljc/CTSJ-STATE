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
   */
  return (Component) => {
    class WrapClass extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          state: null,
        };
      }

      componentDidMount() {
        this.unsubscribe = this.context.store.subscribe((action) => {
          const state = this.context.store.getState();
          this.setState({
            state,
          }, () => {
            // 如果是当前实力进行的数据更改才会调用success
            const { success, ins, ...other } = action;
            // console.log('redux进行了数据改变的通知');
            // console.log(action);
            // console.log(this.ins);
            // console.log(this.ins === ins);
            if (success && ins) {
              if (this.ins === ins) {
                success.call(ins, Immutable.cloneDeep(other));
              }
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
        const { store } = this.context;

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
