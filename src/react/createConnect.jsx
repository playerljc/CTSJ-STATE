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
   */
  return (Component) => {
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          state: null,
        };
      }

      componentDidMount() {
        this.unsubscribe = this.store.subscribe((action) => {
          const state = this.store.getState();
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
              props = mapStateToProps(state);
            }

            return (
              <Component
                ref={ins => {
                  this.ins = ins;
                }}
                {...this.props}
                {...props}
                {...dispatch}
                dispatch={store.dispatch}
              />
            );
          }}
          </ProviderContext.Consumer>
        );
      }
    };
  };
};
