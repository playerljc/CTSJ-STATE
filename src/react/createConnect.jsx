import React from 'react';

import { ProviderContext } from './Context';
import Immutable from '../util/immutable';

/**
 * createConnect
 * @param mapStateToProps
 * @param mapDispatchToProps
 */
export default (mapStateToProps, mapDispatchToProps) =>
  /**
   * ConnectHOC - 一个提供store处理的工厂类
   *   isClear: boolean - 是否清除页面用到的store数据
   *   clearGroups: [
   *     {
   *        type: string - 清除页面store数据dispatch的type
   *        defaultState: object - 清除页面store数据的assign
   *     }
   *   ]
   * }
   * @param Component
   * @param Config
   */
  (Component, Config) => {
    class CreateConnect extends React.Component {
      /**
       * constructor
       * @param props
       */
      constructor(props) {
        super(props);

        this.state = {
          state: null,
        };
      }

      /**
       * componentDidMount
       */
      componentDidMount() {
        const { store } = this;

        // 注册store的更改事件
        this.unsubscribe = store.subscribe(this.onSubscribe);
      }

      /**
       * componentWillUnmount
       */
      componentWillUnmount() {
        // 加入清理页面用到的store的操作
        if (Config && Config.isClear) {
          const { clearGroup = [] } = Config;
          clearGroup.forEach(({ type = '', defaultState = {} }) => {
            this.store.dispatch({
              type,
              ...(defaultState || {}),
            });
          });
        }

        this.unsubscribe();
      }

      /**
       * onSubscribe
       * @param action
       */
      onSubscribe = (action) => {
        const { store } = this;

        // store的数据
        const state = store.getState();

        // 之前state的数据
        this.setState(
          {
            state,
          },
          () => {
            // 如果是当前实力进行的数据更改才会调用success
            const { success, ins, ...other } = action;
            // console.log('redux进行了数据改变的通知');
            // console.log(action);
            // console.log(this.ins);
            // console.log(this.ins === ins);
            if (success && ins) {
              if (/* this.ins */ this.ref.current === ins) {
                success.call(ins, Immutable.cloneDeep(other));
              }
            }
          },
        );
      };

      // /**
      //  * getInstance
      //  * @return {ReactElement}
      //  */
      // getInstance() {
      //   return this.ins;
      // }

      /**
       * render
       * @return {*}
       */
      render() {
        return (
          <ProviderContext.Consumer>
            {({ store }) => {
              if (!this.store) this.store = store;
              // 将store的数据存储在state中
              const state = this.state.state ? this.state.state : this.store.getState();

              let dispatch = {};

              // mapDispatchToProps
              if (mapDispatchToProps) {
                dispatch = mapDispatchToProps(this.store.dispatch.bind(this.store));
              }

              let props = {};

              // mapStateToProps
              if (mapStateToProps) {
                props = mapStateToProps(state);
              }

              this.ref = this.props.forwardedRef || React.createRef();

              return (
                <Component
                  // ref={(ins) => {
                  //   this.ins = ins;
                  // }}
                  ref={this.ref}
                  {...this.props}
                  {...props}
                  {...dispatch}
                  dispatch={store.dispatch.bind(store)}
                />
              );
            }}
          </ProviderContext.Consumer>
        );
      }
    }

    return React.forwardRef((props, ref) => {
      return <CreateConnect {...props} forwardedRef={ref} />;
    });
  };
